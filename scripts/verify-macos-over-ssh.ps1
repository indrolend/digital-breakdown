param(
    [string]$HostAlias = "digital-breakdown-mac",
    [string]$RepositoryPath = "~/Projects/digital-breakdown",
    [string]$Branch = "release/pr3-internal-rc-pipeline",
    [string]$Remote = "github"
)

$ErrorActionPreference = "Stop"
$remoteScript = @'
set -euo pipefail
repo="$1"
remote="$2"
branch="$3"
git -C "$repo" diff --quiet
git -C "$repo" diff --cached --quiet
git -C "$repo" fetch --no-tags "$remote" "$branch"
commit="$(git -C "$repo" rev-parse FETCH_HEAD)"
parent="${TMPDIR:-/tmp}"
worktree="$(mktemp -d "$parent/data-macos-verify.XXXXXX")"
rmdir "$worktree"
cleanup() {
  git -C "$repo" worktree remove --force "$worktree" >/dev/null 2>&1 || true
  rmdir "$worktree" >/dev/null 2>&1 || true
}
trap cleanup EXIT
git -C "$repo" worktree add --detach "$worktree" "$commit"
cd "$worktree"
node tools/validate-asset-inventory.mjs
bash scripts/verify-macos-baseline.sh
'@

$encoded=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($remoteScript))
$command="echo '$encoded' | base64 --decode | bash -s -- '$RepositoryPath' '$Remote' '$Branch'"
& ssh -o BatchMode=yes $HostAlias $command
if($LASTEXITCODE -ne 0){throw "Remote macOS verification failed with exit code $LASTEXITCODE."}

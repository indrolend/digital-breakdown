# Cross-platform development workspace

Open `Data.code-workspace` in VS Code. Its tasks use repository-relative paths
and the existing canonical build scripts; no local SDK or repository path is
committed.

## Private machine aliases

Keep real hostnames, addresses, usernames, and key paths in each developer's
private `~/.ssh/config`; do not commit them. A typical Mac alias on a PC is:

```sshconfig
Host data-mac
    HostName <private-dns-name-or-address>
    User <mac-user>
    IdentityFile <private-key-path>
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

On the Mac, add an equivalent PC entry to `~/.ssh/config`:

```sshconfig
Host data-pc
    HostName <private-dns-name-or-address>
    User <windows-user>
    IdentityFile <private-key-path>
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

Use VS Code’s **Remote-SSH: Connect to Host** command with
the private alias configured on that machine. Each machine should keep its own
clone and build directory. Exchange source through Git branches rather than
copying build outputs between operating systems.

## Shared tasks

Use **Tasks: Run Task**:

- `Data: asset release gate`
- `Windows: environment status`
- `Windows: desktop Release build`
- `Windows: native tests`
- `Android: assemble debug`
- `macOS: verify locally`
- `SSH: check Mac connection`
- `SSH: verify current commit on Mac`

The remote Mac verification task prompts for the Mac repository path and branch.
It performs a fast-forward-only pull, runs the asset gate, and then runs the
tracked macOS verifier. It never edits or invokes the untracked
`scripts/build-macos-release.sh`.

Do not share `.env` files, signing keys, Gradle local properties, build
directories, or store credentials through the workspace.

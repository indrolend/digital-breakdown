#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const inventoryPath=path.join(root,"docs","assets","inventory.csv");
const gate=JSON.parse(fs.readFileSync(path.join(root,"docs","assets","release-gate.json"),"utf8"));
const required=["Path","Category","Runtime Used","Ships in Release","Source","Creator","License","Modified","Attribution Required","Commercial Redistribution Allowed","Verified","Risk Level","Status","Recommended Action","Notes"];
function parse(text){
  const rows=[];let row=[],cell="",quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(quoted&&c==='"'&&text[i+1]==='"'){cell+='"';i++;}
    else if(c==='"')quoted=!quoted;
    else if(c===","&&!quoted){row.push(cell);cell="";}
    else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell="";}
    else cell+=c;
  }
  if(quoted)throw new Error("Unclosed CSV quote");
  return rows;
}
function filesUnder(relative){
  const directory=path.join(root,relative);
  return fs.readdirSync(directory,{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>`${relative}/${entry.name}`);
}
const parsed=parse(fs.readFileSync(inventoryPath,"utf8")),header=parsed.shift();
const errors=[],column=Object.fromEntries(header.map((name,i)=>[name,i]));
for(const name of required)if(column[name]===undefined)errors.push(`Missing required column: ${name}`);
for(const [index,row] of parsed.entries())if(row.length!==header.length)errors.push(`Row ${index+2} has ${row.length} fields; expected ${header.length}`);
const get=(row,name)=>row[column[name]]??"";
const seen=new Set();
for(const [index,row] of parsed.entries()){
  const line=index+2,assetPath=get(row,"Path").trim();
  if(!assetPath)errors.push(`Row ${line}: blank Path`);
  if(seen.has(assetPath))errors.push(`Row ${line}: duplicate Path: ${assetPath}`);seen.add(assetPath);
  if(!gate.allowedStatuses.includes(get(row,"Status")))errors.push(`Row ${line}: invalid Status ${get(row,"Status")}`);
  if(!gate.allowedRiskLevels.includes(get(row,"Risk Level")))errors.push(`Row ${line}: invalid Risk Level ${get(row,"Risk Level")}`);
}
const shipping=[
  ...filesUnder("native-desktop/audio"),...filesUnder("native-desktop/fonts"),
  ...filesUnder("native-models"),...filesUnder("native-tv-gifs"),
  ...filesUnder("native-android/app/src/main/res/raw"),...filesUnder("reference/browser-pass7/audio")
];
for(const assetPath of shipping){
  const matches=parsed.filter(row=>get(row,"Path").split(";").map(value=>value.trim()).includes(assetPath));
  if(matches.length!==1){errors.push(`${assetPath}: expected exactly one inventory entry, found ${matches.length}`);continue;}
  const row=matches[0],status=get(row,"Status");
  if(gate.blockedShippingStatuses.includes(status))errors.push(`${assetPath}: shipping status ${status} blocks release`);
  if(status==="TEMPORARY"&&(get(row,"Verified")!=="Yes"||get(row,"Commercial Redistribution Allowed")!=="Yes"))
    errors.push(`${assetPath}: TEMPORARY shipping asset must be verified and commercially redistributable`);
}
const forbiddenNames=[
  "capture_1.mp3","capture_2.mp3","capture_3.mp3","capture_4.mp3","capture_5.mp3",
  "connect_power.mp3","end_call_tone.mp3","game_music.mp3","game_over.mp3","headshot.mp3",
  "headshot_critical.mp3","low_power.mp3","menu_music.mp3","negative_ack.mp3",
  "payment_failure.mp3","payment_success.mp3","phone_attack.mp3","received_message.mp3",
  "reward_nice.mp3","reward_woah.mp3","sent_message.mp3","slurp_ringtone.mp3",
  "tv_room_pad.mp3","vc_ended.mp3","vc_invitation.mp3"
];
for(const assetPath of shipping)if(forbiddenNames.includes(path.basename(assetPath)))errors.push(`${assetPath}: prohibited removed filename`);
const embedded=fs.readFileSync(path.join(root,"reference","browser-pass7","assets","embedded-assets.js"),"utf8");
for(const token of ["IPHONE_GLB_BASE64","SFX_AUDIO_BASE64"])if(embedded.includes(token))errors.push(`embedded-assets.js: removed payload ${token} was reintroduced`);
if(errors.length){console.error(`Asset release gate failed (${errors.length}):\n- ${errors.join("\n- ")}`);process.exit(1);}
const counts=Object.fromEntries(gate.allowedStatuses.map(status=>[status,parsed.filter(row=>get(row,"Status")===status).length]));
console.log(`Asset release gate passed: ${parsed.length} rows cover ${shipping.length} shipping files.`);
console.log(`Inventory status totals: ${JSON.stringify(counts)}`);

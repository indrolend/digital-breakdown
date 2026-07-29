#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const file=path.join(root,"docs","assets","inventory.csv");
function parse(text){
  const rows=[];let row=[],cell="",quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(quoted&&c==='"'&&text[i+1]==='"'){cell+='"';i++;}
    else if(c==='"')quoted=!quoted;
    else if(c===","&&!quoted){row.push(cell);cell="";}
    else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&text[i+1]==="\n")i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell="";}
    else cell+=c;
  }
  return rows;
}
const quote=value=>`"${String(value).replaceAll('"','""')}"`;
const rows=parse(fs.readFileSync(file,"utf8"));
const header=rows.shift(),index=Object.fromEntries(header.map((name,i)=>[name,i]));
const get=(row,name)=>row[index[name]],set=(row,name,value)=>{row[index[name]]=value;};
const oldAudioRows=rows.filter(row=>/\.mp3(?:;|$)/.test(get(row,"Path")));
for(const row of oldAudioRows){
  set(row,"Runtime Used","No; removed from all current runtimes");
  set(row,"Ships in Release","No; removed");
  set(row,"Status","REMOVE");
  set(row,"Recommended Action","Keep absent; prohibited filename checks prevent reintroduction");
  set(row,"Notes",`${get(row,"Notes")}; removed 2026-07-29 and replaced by project-generated WAV`);
}
for(const row of rows){
  const assetPath=get(row,"Path");
  if(assetPath==="reference/browser-pass7/assets/embedded-assets.js::IPHONE_GLB_BASE64"){
    set(row,"Runtime Used","No; removed from public source");
    set(row,"Ships in Release","No; removed");
    set(row,"Status","REMOVE");
    set(row,"Recommended Action","Keep payload absent");
    set(row,"Notes",`${get(row,"Notes")}; removed 2026-07-29`);
  } else if(assetPath==="native-models/phone.dbmesh"||assetPath.endsWith("/raw/phone.dbmesh")){
    set(row,"Source","tools/generate-release-safe-placeholders.mjs");
    set(row,"Creator","Data project contributors");
    set(row,"License","AGPL-3.0-only");
    set(row,"Modified","Generated from repository-owned geometry code");
    set(row,"Attribution Required","No");
    set(row,"Commercial Redistribution Allowed","Yes");
    set(row,"Verified","Yes");
    set(row,"Risk Level","Low");
    set(row,"Status","TEMPORARY");
    set(row,"Recommended Action","Retain for safe previews; replace only for final art direction");
    set(row,"Notes","Original 144-vertex generic slab; former uncleared derivative overwritten");
  } else if(/^native-tv-gifs\/tv\d\d\.dbgif$/.test(assetPath)){
    set(row,"Source","tools/generate-release-safe-placeholders.mjs");
    set(row,"Creator","Data project contributors");
    set(row,"License","AGPL-3.0-only");
    set(row,"Modified","Deterministically generated");
    set(row,"Attribution Required","No");
    set(row,"Commercial Redistribution Allowed","Yes");
    set(row,"Verified","Yes");
    set(row,"Risk Level","Low");
    set(row,"Status","TEMPORARY");
    set(row,"Recommended Action","Retain for safe previews; replace only for final visual direction");
    set(row,"Notes","Original abstract signal overwrote archive-derived clip; no source media used");
  }
}
if(!rows.some(row=>get(row,"Path")==="native-tv-gifs/tv08.dbgif")){
  const template=[...rows].find(row=>get(row,"Path")==="native-tv-gifs/tv07.dbgif");
  const added=[...template];set(added,"Path","native-tv-gifs/tv08.dbgif");rows.push(added);
}
const audioNames=[
  "capture_loop.wav","capture_success_1.wav","capture_success_2.wav","capture_success_3.wav",
  "capture_success_4.wav","capture_success_5.wav","device_connect.wav","door_knock.wav",
  "gameplay_loop.wav","game_over.wav","impact.wav","impact_critical.wav","menu_loop.wav",
  "message_received.wav","message_sent.wav","player_attack.wav","reward_high.wav","reward_soft.wav",
  "tv_ambience_loop.wav","ui_cancel.wav","ui_confirm.wav","ui_invite.wav","ui_warning.wav"
];
for(const name of audioNames){
  const assetPath=`native-desktop/audio/${name}; native-android/app/src/main/res/raw/${name}; reference/browser-pass7/audio/${name}`;
  if(rows.some(row=>get(row,"Path")===assetPath))continue;
  const category=name.includes("loop")||name==="game_over.wav"?"Music or ambience":"Sound effect";
  rows.push([
    assetPath,category,"Yes; desktop, Android, and browser reference","Yes; all current runtimes",
    "tools/generate-release-safe-placeholders.mjs","Data project contributors","AGPL-3.0-only",
    "Deterministically synthesized from sine waves, envelopes, and seeded noise","No","Yes","Yes","Low",
    "TEMPORARY","Retain for safe previews; replace only for final audio direction",
    "Original PCM WAV; contains no sampled source media"
  ]);
}
fs.writeFileSync(file,[header,...rows].map(row=>row.map(quote).join(",")).join("\n")+"\n");
console.log(`Updated ${rows.length} inventory rows.`);

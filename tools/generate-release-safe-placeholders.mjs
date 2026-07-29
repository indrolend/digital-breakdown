#!/usr/bin/env node
// Deterministic project-owned placeholders. Uses only the Node.js standard library
// and never reads or transforms pre-existing media.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const desktop=path.join(root,"native-desktop","audio");
const android=path.join(root,"native-android","app","src","main","res","raw");
const browser=path.join(root,"reference","browser-pass7","audio");
const tvDir=path.join(root,"native-tv-gifs");
const modelDir=path.join(root,"native-models");
const embeddedPath=path.join(root,"reference","browser-pass7","assets","embedded-assets.js");
const rate=22050;
const oldAudio=new Set([
  "capture_1.mp3","capture_2.mp3","capture_3.mp3","capture_4.mp3","capture_5.mp3",
  "connect_power.mp3","door_knock.mp3","end_call_tone.mp3","game_music.mp3",
  "game_over.mp3","headshot.mp3","headshot_critical.mp3","low_power.mp3",
  "menu_music.mp3","negative_ack.mp3","payment_failure.mp3","payment_success.mp3",
  "phone_attack.mp3","received_message.mp3","reward_nice.mp3","reward_woah.mp3",
  "sent_message.mp3","slurp_ringtone.mp3","tv_room_pad.mp3","vc_ended.mp3",
  "vc_invitation.mp3"
]);

const clamp=value=>Math.max(-0.92,Math.min(0.92,value));
function envelope(t,duration,attack=0.008,release=0.08){
  return Math.min(1,t/attack)*Math.min(1,(duration-t)/release);
}
function tone(duration,frequencies,{sweep=0,pulses=0,noise=0}={}){
  const frames=Math.floor(rate*duration),result=new Float32Array(frames);let state=0xD47A2026;
  for(let i=0;i<frames;i++){
    const t=i/rate;let value=0;
    frequencies.forEach((frequency,index)=>{value+=Math.sin(2*Math.PI*(frequency*t+sweep*t*t*0.5))/(index+1.5);});
    state=(Math.imul(state,1664525)+1013904223)>>>0;
    const grain=(((state>>>16)&65535)/32767.5-1)*noise;
    const pulse=pulses<=0?1:0.35+0.65*(0.5+0.5*Math.sin(2*Math.PI*pulses*t));
    result[i]=clamp((value*0.22+grain)*envelope(t,duration)*pulse);
  }
  return result;
}
function loopTone(duration,frequencies,modulation){
  const frames=Math.floor(rate*duration),result=new Float32Array(frames);
  for(let i=0;i<frames;i++){
    const t=i/rate;
    const value=frequencies.reduce((sum,frequency,index)=>sum+Math.sin(2*Math.PI*frequency*t)/(index+2),0);
    result[i]=clamp(value*(0.72+0.28*Math.sin(2*Math.PI*modulation*t))*0.18);
  }
  return result;
}
function knock(){
  const result=new Float32Array(Math.floor(rate*1.2));let state=0x4B4E4F43;
  for(const start of [0.08,0.43,0.76]){
    const first=Math.floor(start*rate);
    for(let i=0;i<Math.floor(0.13*rate);i++){
      const t=i/rate;state=(Math.imul(state,1103515245)+12345)&0x7fffffff;
      const grain=state/0x3fffffff-1;
      const body=Math.sin(2*Math.PI*118*t)+0.35*Math.sin(2*Math.PI*236*t);
      result[first+i]=clamp(result[first+i]+(body*0.22+grain*0.08)*Math.exp(-t*34));
    }
  }
  return result;
}
function wav(samples){
  const dataBytes=samples.length*2,buffer=Buffer.alloc(44+dataBytes);
  buffer.write("RIFF",0);buffer.writeUInt32LE(36+dataBytes,4);buffer.write("WAVEfmt ",8);
  buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);
  buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*2,28);buffer.writeUInt16LE(2,32);
  buffer.writeUInt16LE(16,34);buffer.write("data",36);buffer.writeUInt32LE(dataBytes,40);
  for(let i=0;i<samples.length;i++)buffer.writeInt16LE(Math.round(clamp(samples[i])*32767),44+i*2);
  return buffer;
}
function generateAudio(){
  const cues=new Map([
    ["ui_cancel.wav",tone(.24,[196,147],{sweep:-95})],
    ["ui_invite.wav",tone(.34,[247,371],{pulses:5})],
    ["device_connect.wav",tone(.28,[174,261],{sweep:180})],
    ["ui_warning.wav",tone(.42,[132,198],{pulses:7})],
    ["message_received.wav",tone(.22,[330,495],{sweep:90})],
    ["message_sent.wav",tone(.18,[294,441],{sweep:210})],
    ["player_attack.wav",tone(.16,[92,184],{sweep:-220,noise:.04})],
    ["ui_confirm.wav",tone(.24,[262,393],{sweep:120})],
    ["capture_loop.wav",loopTone(2,[84,126,168],1)],
    ...[1,2,3,4,5].map((n,i)=>[`capture_success_${n}.wav`,tone(.30+i*.02,[220+i*14,330+i*21],{sweep:100+i*25})]),
    ["impact.wav",tone(.20,[72,144],{sweep:-160,noise:.14})],
    ["impact_critical.wav",tone(.30,[65,130,260],{sweep:-240,noise:.18})],
    ["reward_high.wav",tone(.28,[370,555],{sweep:170})],
    ["reward_soft.wav",tone(.24,[294,441],{sweep:90})],
    ["door_knock.wav",knock()],
    ["menu_loop.wav",loopTone(8,[55,82.5,110],.125)],
    ["gameplay_loop.wav",loopTone(8,[48,72,96],.25)],
    ["tv_ambience_loop.wav",loopTone(8,[45,67.5,90],.375)],
    ["game_over.wav",tone(1.6,[110,82.5,55],{sweep:-22,pulses:2})]
  ]);
  for(const directory of [desktop,android,browser]){
    fs.mkdirSync(directory,{recursive:true});
    for(const name of oldAudio)fs.rmSync(path.join(directory,name),{force:true});
    for(const [name,samples] of cues)fs.writeFileSync(path.join(directory,name),wav(samples));
  }
}
function rgb565(r,g,b){return ((r>>3)<<11)|((g>>2)<<5)|(b>>3);}
function generateTv(){
  fs.mkdirSync(tvDir,{recursive:true});
  const palette=[[18,62,78],[72,30,94],[22,94,70],[106,72,24],[82,24,42],[26,42,104]];
  for(let channel=1;channel<=15;channel++){
    const parts=[Buffer.from("DBGF"),Buffer.alloc(6)];parts[1].writeUInt16LE(12,0);parts[1].writeUInt16LE(8,2);parts[1].writeUInt16LE(24,4);
    for(let frame=0;frame<24;frame++){
      const data=Buffer.alloc(2+12*8*2);data.writeUInt16LE(90,0);
      for(let y=0;y<8;y++)for(let x=0;x<12;x++){
        const scan=(y+frame)%3===0?24:0,base=palette[Math.floor((x*5+frame+channel*3)/4)%6];
        const interference=((x*17+y*29+frame*13+channel*7)%19)*2;
        data.writeUInt16LE(rgb565(Math.min(255,base[0]+scan+interference),Math.min(255,base[1]+scan),Math.min(255,base[2]+interference)),2+(y*12+x)*2);
      }
      parts.push(data);
    }
    fs.writeFileSync(path.join(tvDir,`tv${String(channel).padStart(2,"0")}.dbgif`),Buffer.concat(parts));
  }
}
function addBox(vertices,batches,center,size,color){
  const [cx,cy,cz]=center,[sx,sy,sz]=size.map(v=>v*.5);
  const c=[[cx-sx,cy-sy,cz-sz],[cx+sx,cy-sy,cz-sz],[cx+sx,cy+sy,cz-sz],[cx-sx,cy+sy,cz-sz],[cx-sx,cy-sy,cz+sz],[cx+sx,cy-sy,cz+sz],[cx+sx,cy+sy,cz+sz],[cx-sx,cy+sy,cz+sz]];
  const indices=[0,2,1,0,3,2,4,5,6,4,6,7,0,4,7,0,7,3,1,2,6,1,6,5,3,7,6,3,6,2,0,1,5,0,5,4],start=vertices.length/3;
  for(const index of indices)vertices.push(...c[index]);batches.push({start,count:indices.length,color});
}
function dbm(vertices,batches){
  const buffer=Buffer.alloc(12+vertices.length*4+batches.length*24);let at=0;
  buffer.write("DBM1",at);at+=4;buffer.writeUInt32LE(vertices.length/3,at);at+=4;buffer.writeUInt32LE(batches.length,at);at+=4;
  for(const value of vertices){buffer.writeFloatLE(value,at);at+=4;}
  for(const batch of batches){buffer.writeUInt32LE(batch.start,at);at+=4;buffer.writeUInt32LE(batch.count,at);at+=4;for(const value of batch.color){buffer.writeFloatLE(value,at);at+=4;}}
  return buffer;
}
function generatePhone(){
  const vertices=[],batches=[];
  addBox(vertices,batches,[0,0,0],[.074,.154,.011],[.12,.18,.22,1]);
  addBox(vertices,batches,[0,0,-.006],[.066,.132,.002],[.03,.10,.14,1]);
  addBox(vertices,batches,[.020,.060,.006],[.010,.006,.003],[.32,.72,.68,1]);
  addBox(vertices,batches,[-.014,.061,.006],[.018,.003,.003],[.78,.36,.46,1]);
  const output=dbm(vertices,batches);fs.mkdirSync(modelDir,{recursive:true});
  fs.writeFileSync(path.join(modelDir,"phone.dbmesh"),output);
  fs.writeFileSync(path.join(android,"phone.dbmesh"),output);
  const manifestPath=path.join(modelDir,"manifest.json");
  const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
  manifest.phone={
    vertices:vertices.length/3,
    batches:batches.length,
    bytes:output.length,
    source:"tools/generate-release-safe-placeholders.mjs",
    ownership:"Data project",
    status:"TEMPORARY"
  };
  fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
}
function removeEmbeddedPhone(){
  let source=fs.readFileSync(embeddedPath,"utf8");
  source=source.replace(/\n?const IPHONE_GLB_BASE64\s*=\s*`[\s\S]*?`;\s*/,"\n");
  source=source.replace(/\n?const SFX_AUDIO_BASE64\s*=\s*Object\.freeze\(\{[\s\S]*?\}\);\s*/,"\n");
  source=source.replace(/\s*IPHONE_GLB_BASE64,\s*/,"\n");
  source=source.replace(/\s*SFX_AUDIO_BASE64,\s*/,"\n");
  fs.writeFileSync(embeddedPath,source);
}
generateAudio();generateTv();generatePhone();removeEmbeddedPhone();
console.log("Generated release-safe placeholder audio, TV signals, and phone model.");

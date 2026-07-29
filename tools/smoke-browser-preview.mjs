#!/usr/bin/env node
const base=process.env.DATA_PREVIEW_URL??"http://127.0.0.1:4173/";
const required=[
  "index.html","index_module.mjs","assets/embedded-assets.js",
  "audio/capture_loop.wav","audio/capture_success_1.wav",
  "audio/capture_success_2.wav","audio/capture_success_3.wav",
  "audio/capture_success_4.wav","audio/capture_success_5.wav",
  "audio/device_connect.wav","audio/door_knock.wav","audio/game_over.wav",
  "audio/gameplay_loop.wav","audio/impact.wav","audio/impact_critical.wav",
  "audio/menu_loop.wav","audio/message_received.wav","audio/message_sent.wav",
  "audio/player_attack.wav","audio/reward_high.wav","audio/reward_soft.wav",
  "audio/tv_ambience_loop.wav","audio/ui_cancel.wav","audio/ui_confirm.wav",
  "audio/ui_invite.wav","audio/ui_warning.wav"
];
const failures=[];
for(const relative of required){
  const response=await fetch(new URL(relative,base));
  if(!response.ok)failures.push(`${relative}: HTTP ${response.status}`);
  const bytes=await response.arrayBuffer();
  if(bytes.byteLength===0)failures.push(`${relative}: empty response`);
}
const removed=[
  "audio/vc_ended.mp3","audio/vc_invitation.mp3","audio/connect_power.mp3",
  "audio/low_power.mp3","audio/negative_ack.mp3","audio/received_message.mp3",
  "audio/sent_message.mp3","audio/phone_attack.mp3","audio/payment_success.mp3",
  "audio/payment_failure.mp3","audio/end_call_tone.mp3","audio/slurp_ringtone.mp3",
  "audio/capture_1.mp3","audio/capture_2.mp3","audio/capture_3.mp3",
  "audio/capture_4.mp3","audio/capture_5.mp3"
];
for(const relative of removed){
  const response=await fetch(new URL(relative,base));
  if(response.status!==404)failures.push(`${relative}: expected HTTP 404, received ${response.status}`);
}
if(failures.length){
  console.error(`Browser HTTP smoke failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Browser HTTP smoke passed: ${required.length} non-empty responses from ${base}`);

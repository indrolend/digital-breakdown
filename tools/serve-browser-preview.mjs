#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const documentRoot=path.join(repositoryRoot,"reference","browser-pass7");
const host=process.env.DATA_PREVIEW_HOST??"127.0.0.1";
const port=Number(process.env.DATA_PREVIEW_PORT??4173);
const types=new Map([
  [".html","text/html; charset=utf-8"],[".mjs","text/javascript; charset=utf-8"],
  [".js","text/javascript; charset=utf-8"],[".css","text/css; charset=utf-8"],
  [".json","application/json; charset=utf-8"],[".wav","audio/wav"],
  [".png","image/png"],[".svg","image/svg+xml"]
]);

function resolveRequest(url){
  const pathname=decodeURIComponent(new URL(url,`http://${host}:${port}`).pathname);
  const relative=pathname==="/"?"/index.html":pathname;
  const candidate=path.resolve(documentRoot,`.${relative}`);
  return candidate===documentRoot||candidate.startsWith(`${documentRoot}${path.sep}`)?candidate:null;
}

console.log(`DATA_BROWSER_PREVIEW_STARTING ${documentRoot}`);

const server=http.createServer((request,response)=>{
  const filename=resolveRequest(request.url??"/");
  if(!filename){response.writeHead(403);response.end("Forbidden\n");return;}
  fs.stat(filename,(error,stats)=>{
    if(error||!stats.isFile()){response.writeHead(404);response.end("Not found\n");return;}
    response.writeHead(200,{
      "Content-Type":types.get(path.extname(filename).toLowerCase())??"application/octet-stream",
      "Cache-Control":"no-store",
      "X-Content-Type-Options":"nosniff"
    });
    if(request.method==="HEAD"){response.end();return;}
    fs.createReadStream(filename).pipe(response);
  });
});

server.listen(port,host,()=>{
  console.log(`DATA_BROWSER_PREVIEW_READY http://${host}:${port}/`);
});

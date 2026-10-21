import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const files=[
  'assets/iss-nasa.glb',
  'assets/draco/draco_decoder.wasm',
  'assets/draco/draco_wasm_wrapper.js',
  'assets/draco/draco_decoder.js',
  'assets/draco/LICENSE.txt',
  'assets/fonts/IBMPlexMono-Regular.ttf',
  'assets/fonts/OFL.txt',
  'assets/ISS_CREDITS.txt',
  'licenses/THIRD_PARTY_NOTICES.txt',
  'licenses/react-three-fiber.txt',
];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const html=readFileSync('dist/index.html','utf8');
const linked=[...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(match=>match[1].slice(2));
for(const file of [...files,...linked]){
  if(!existsSync(resolve('dist',file)))throw new Error(`Missing build asset: ${file}`);
}
for(const file of files){
  if(digest(readFileSync(resolve('dist',file)))!==digest(readFileSync(resolve('public',file))))throw new Error(`Build modified asset: ${file}`);
}
console.log(`Local build verified: ${files.length} static resources and ${linked.length} entry assets.`);
const requested=process.argv[2];
if(requested){
  const site=new URL(requested);
  if(site.protocol!=='https:')throw new Error('Use the real HTTPS deployment URL.');
  const root=new URL(site.href.endsWith('/')?site.href:`${site.href}/`);
  const response=await fetch(root,{signal:AbortSignal.timeout(30000)});
  const page=await response.text();
  if(!response.ok||!page.includes('GFSSM Structure Lab'))throw new Error(`Deployment homepage unavailable or protected: HTTP ${response.status}`);
  for(const file of [...files,...linked]){
    const response=await fetch(new URL(file,root),{signal:AbortSignal.timeout(30000)});
    if(!response.ok)throw new Error(`${file}: HTTP ${response.status}`);
    const bytes=Buffer.from(await response.arrayBuffer());
    if(digest(bytes)!==digest(readFileSync(resolve('dist',file))))throw new Error(`${file}: response differs from the verified build (possible login/404 fallback).`);
    if(file.endsWith('.wasm')&&!response.headers.get('content-type')?.includes('application/wasm'))throw new Error(`${file}: incorrect WASM content type`);
    console.log(`HTTPS OK ${file} (${bytes.length} bytes)`);
  }
  console.log('Published files match this build. WebGL controls and missions still require the browser interaction check.');
}else console.log('Online check pending: pass the deployed HTTPS URL as the first argument.');

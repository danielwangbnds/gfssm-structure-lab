import {readdirSync,readFileSync,realpathSync,existsSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
const seen=new Set(),notices=[];
function collect(directory){
  let real;
  try{real=realpathSync(directory);}catch{return;}
  if(seen.has(real)||!existsSync(join(real,'package.json')))return;
  seen.add(real);
  const info=JSON.parse(readFileSync(join(real,'package.json'),'utf8'));
  const files=readdirSync(real).filter(file=>/^(LICEN[CS]E|COPYING|NOTICE)(\.|$)/i.test(file));
  const texts=files.flatMap(file=>{try{return [`--- ${file} ---\n${readFileSync(join(real,file),'utf8')}`];}catch{return [];}});
  const entry=`${info.name} ${info.version}\nLicense: ${typeof info.license==='string'?info.license:JSON.stringify(info.license??'See package license')}\n${typeof info.repository==='string'?info.repository:info.repository?.url??''}\n${texts.join('\n\n')}`;
  notices.push(entry);
}
function collectModules(modules){
  for(const pkg of readdirSync(modules)){
    if(pkg.startsWith('.'))continue;
    if(pkg.startsWith('@'))for(const child of readdirSync(join(modules,pkg)))collect(join(modules,pkg,child));
    else collect(join(modules,pkg));
  }
}
if(existsSync('node_modules/.pnpm')){
  for(const entry of readdirSync('node_modules/.pnpm',{withFileTypes:true})){
    const modules=join('node_modules/.pnpm',entry.name,'node_modules');
    if(entry.isDirectory()&&existsSync(modules))collectModules(modules);
  }
}else collectModules('node_modules');
notices.sort();
mkdirSync('public/licenses',{recursive:true});
writeFileSync('public/licenses/THIRD_PARTY_NOTICES.txt',`GFSSM Structure Lab — third-party software notices\nGenerated from installed dependency packages. Includes development and unused optional modules.\nReact Three Fiber's separately retrieved MIT notice is in react-three-fiber.txt.\nDraco's Apache 2.0 license is in ../assets/draco/LICENSE.txt.\n\n${notices.join('\n\n'+'='.repeat(72)+'\n\n')}\n`);
console.log(`Saved notices for ${notices.length} dependency packages.`);

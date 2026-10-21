import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('NASA reference is a self-contained GLB with local Draco decoding',()=>{
  const path=new URL('../public/assets/iss-nasa.glb',import.meta.url);
  const bytes=readFileSync(path);
  assert.equal(bytes.toString('ascii',0,4),'glTF');
  assert.equal(bytes.readUInt32LE(4),2);
  assert.equal(bytes.readUInt32LE(8),bytes.length);
  const json=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
  assert.ok(bytes.length<500_000,'Keep the compressed reference below 500 kB');
  for(const entry of [...(json.buffers??[]),...(json.images??[])])assert.equal(entry.uri,undefined,'Do not request external textures or buffers');
  assert.ok(json.extensionsRequired.includes('KHR_draco_mesh_compression'));
  for(const file of ['draco_decoder.js','draco_decoder.wasm','draco_wasm_wrapper.js','LICENSE.txt']){
    assert.ok(existsSync(new URL(`../public/assets/draco/${file}`,import.meta.url)));
  }
  assert.match(readFileSync(new URL('../ASSET_SOURCES.md',import.meta.url),'utf8'),new RegExp(createHash('sha256').update(bytes).digest('hex')));
});

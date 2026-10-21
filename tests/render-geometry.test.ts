import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, DoubleSide, Euler, ExtrudeGeometry, LatheGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector3 } from 'three';
import { bracketProfile, uprightFace, habitatProfile } from '../src/models/geometry.ts';

const material=new MeshBasicMaterial({side:DoubleSide});
const ray=(mesh:Mesh,y:number,z:number)=>new Raycaster(new Vector3(-250,y,z),new Vector3(1,0,0)).intersectObject(mesh);

test('rendered bracket has the correct orientation and a real through-hole after Cut',()=>{
  for(const l of [60,80,120])for(const t of [4,8,12])for(const h of [35,50,75]){
    const joined=new Mesh(new ExtrudeGeometry(bracketProfile(l,t,h),{depth:50,bevelEnabled:false}),material);
    joined.rotation.x=Math.PI/2; joined.position.set(-l/2,25,0); joined.updateMatrixWorld(true);
    const box=new Box3().setFromObject(joined);
    const size=box.getSize(new Vector3());
    assert.ok(Math.abs(size.x-l)<1e-5 && Math.abs(size.y-50)<1e-5 && Math.abs(size.z-(t+h))<1e-5);
    for(const fillet of [false,true]){
      const upright=new Mesh(new ExtrudeGeometry(uprightFace(50,h,true,fillet),{depth:t,bevelEnabled:false,curveSegments:40}),material);
      upright.rotation.copy(new Euler(Math.PI/2,Math.PI/2,0));upright.position.set(-l/2,-25,t);upright.updateMatrixWorld(true);
      assert.equal(ray(upright,0,t+h/2).length,0,'The centre ray must pass completely through the hole');
      assert.ok(ray(upright,15,t+h/2).length>=2,'Material alongside the hole must retain both faces');
      upright.geometry.dispose();
    }
    joined.geometry.dispose();
  }
});

test('rendered habitat rays distinguish solid, blind cavity, and an open hatch',()=>{
  for(const diameter of [60,80,110])for(const length of [80,120,180])for(const stage of [1,2,3]){
    const mesh=new Mesh(new LatheGeometry(habitatProfile(diameter,length,stage),96),material);
    mesh.rotation.z=-Math.PI/2;mesh.updateMatrixWorld(true);
    const cast=(offset:number)=>new Raycaster(new Vector3(length/2+30,offset,0),new Vector3(-1,0,0)).intersectObject(mesh);
    const centre=cast(.1);
    assert.ok(centre.length>0);
    const expected=stage===1?length/2:-length/2+4;
    assert.ok(Math.abs(centre[0].point.x-expected)<1e-4,`stage ${stage}: the axis must hit the expected end face`);
    if(stage===3){
      const plate=cast(diameter*.25);
      assert.ok(Math.abs(plate[0].point.x-(length/2+4))<1e-4,'The hatch plate surrounds, rather than fills, the opening');
    }
    mesh.geometry.dispose();
  }
});

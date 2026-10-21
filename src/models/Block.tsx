import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';

import { Edges } from '@react-three/drei';

import { Group, Vector3 } from 'three';

import type { ModelProps } from '../types';

import { Label } from './Label';

import { Dimension, SketchPlane, SketchRect } from './shared';

export function Block({params:p,stage,dimensions,intro=false}:ModelProps&{intro?:boolean}){

  const solid=stage>=(intro?2:3);
  const body=useRef<Group>(null);
  const h=useRef(.001);

  useFrame(
    (_,dt)=>{
      const target=solid?p.height:.001;
      h.current+=(target-h.current)*(1-Math.exp(-dt*9));
      if(body.current){
        body.current.scale.z=h.current;
        body.current.position.z=h.current/2;
      }
    }
  );

  return <group><SketchPlane length={p.length} width={p.width}/>{!solid&&(stage>0||intro)&&<SketchRect length={p.length} width={p.width}/>}
      <group ref={body} visible={solid} scale={[1,1,.001]}><mesh><boxGeometry args={[p.length,p.width,1]}/><meshStandardMaterial color="#b0c4ce" metalness={.48} roughness={.32}/><Edges color="#e1f4f7" threshold={20}/></mesh></group>
    {intro&&<group position={[p.length/2+15,0,0]}><arrowHelper args={[new Vector3(0,0,1),new Vector3(),60,'#64d9eb',6,3]}/><Label position={[0,0,65]} text="+Z · EXTRUDE"/></group>}
    {dimensions&&(intro?stage>0:stage>=2)&&<><Dimension a={[-p.length/2,-p.width/2-12,0]} b={[p.length/2,-p.width/2-12,0]} label={`${p.length} mm`}/><Dimension a={[-p.length/2-12,-p.width/2,0]} b={[-p.length/2-12,p.width/2,0]} label={`${p.width} mm`}/>{solid&&<Dimension a={[p.length/2+10,p.width/2,0]} b={[p.length/2+10,p.width/2,p.height]} label={`${p.height} mm`}/>}</>}
  </group>;

}

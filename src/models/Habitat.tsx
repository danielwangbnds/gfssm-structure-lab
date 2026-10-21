import { useMemo, useEffect } from 'react';

import { Edges, Line } from '@react-three/drei';

import { LatheGeometry, Shape, ShapeGeometry } from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

import type { ModelProps } from '../types';

import { habitatProfile } from './geometry';

import { Label } from './Label';

import { Dimension } from './shared';

export function Habitat({params:p,stage,section,dimensions}:ModelProps){

  const d=p.diameter,l=p.length,r=d/2;

  const profile=useMemo(()=>habitatProfile(d,l,Math.max(1,stage)),[d,l,stage]);

  const geometry=useMemo(()=>{
    const lathe=new LatheGeometry(profile,96,section?Math.PI:0,section?Math.PI:Math.PI*2);
    const creased=toCreasedNormals(lathe,Math.PI/3);
    lathe.dispose();
    return creased;
  },[profile,section]);

  const cap=useMemo(()=>new ShapeGeometry(new Shape(profile)),[profile]);

  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useEffect(()=>()=>cap.dispose(),[cap]);

  const circle=Array.from({length:97},(_,i)=>[-l/2,Math.cos(i/96*Math.PI*2)*r,Math.sin(i/96*Math.PI*2)*r] as [number,number,number]);

  if(stage===0)return <group><Line points={circle} color="#67d8ed" lineWidth={2}/><mesh position={[-l/2,0,0]} rotation={[0,Math.PI/2,0]}><circleGeometry args={[r,96]}/><meshBasicMaterial color="#67d8ed" transparent opacity={.16} side={2}/></mesh><Label position={[-l/2,-r-15,0]} text={dimensions?`YZ · Ø ${d} mm`:'YZ · SKETCH PLANE'}/></group>;

  return <group><group rotation={[0,0,-Math.PI/2]}><mesh geometry={geometry}><meshStandardMaterial color="#becdd5" metalness={.56} roughness={.3} side={2}/><Edges color="#c9e2eb" threshold={35}/></mesh>{section&&[0,Math.PI].map(angle=><mesh key={angle} geometry={cap} rotation={[0,angle-Math.PI/2,0]}><meshStandardMaterial color="#f0b96f" metalness={.1} roughness={.6} side={2}/></mesh>)}</group>
    <Line points={[[-l/2-20,0,0],[l/2+25,0,0]]} color="#54a1bb" dashed dashSize={3} gapSize={3} lineWidth={.7}/>
    {dimensions&&<><Dimension a={[-l/2,-r-15,-r*.45]} b={[l/2,-r-15,-r*.45]} label={`L ${l} mm`}/><Dimension a={[-l/2-12,-r,0]} b={[-l/2-12,r,0]} label={`Ø ${d} mm`}/>{stage>=2&&<Label position={[0,0,r+10]} text="WALL 4 mm"/>}{stage>=3&&<Label position={[l/2+7,0,-r*.5]} text={`HATCH Ø ${(d*.35).toFixed(1)}`}/>}</>}
  </group>;

}

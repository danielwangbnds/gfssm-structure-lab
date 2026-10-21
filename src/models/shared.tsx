import { Line } from '@react-three/drei';

import type { Vector3Tuple } from 'three';

import { Label } from './Label';

export const cyan='#67d8ed';

export function Dimension({a,b,label}:{a:Vector3Tuple;
  b:Vector3Tuple;
  label:string}){

  const middle=a.map((n,i)=>(n+b[i])/2) as Vector3Tuple;

  return <group><Line points={[a,b]} color="#7cb9c8" lineWidth={1}/>{[a,b].map((p,i)=><mesh key={i} position={p}><sphereGeometry args={[.38,8,8]}/><meshBasicMaterial color={cyan}/></mesh>)}<Label position={middle} text={label}/></group>;

}
export function SketchPlane({length,width}:{length:number;
  width:number}){
  return <group><mesh position={[0,0,-.12]}><planeGeometry args={[length+24,width+24]}/><meshBasicMaterial color="#30bacb" transparent opacity={.055} side={2} depthWrite={false}/></mesh><Label position={[-length/2-9,-width/2-8,0]} text="XY · SKETCH PLANE" subtle/></group>
}
export function SketchRect({length,width}:{length:number;
  width:number}){
  return <group><mesh><planeGeometry args={[length,width]}/><meshBasicMaterial color={cyan} transparent opacity={.17} side={2}/></mesh><Line points={[[-length/2,-width/2,0],[length/2,-width/2,0],[length/2,width/2,0],[-length/2,width/2,0],[-length/2,-width/2,0]]} color={cyan} lineWidth={2}/></group>
}

import { useEffect, useMemo } from 'react';

import { Edges } from '@react-three/drei';

import { ExtrudeGeometry } from 'three';

import type { ModelProps } from '../types';

import { bracketProfile, uprightFace } from './geometry';

import { Dimension, SketchPlane, SketchRect } from './shared';

export function Bracket({params:p,stage,dimensions}:ModelProps){

  const {length:l,thickness:t,height:h}=p;
  const w=50;

  const geom=useMemo(()=>new ExtrudeGeometry(bracketProfile(l,t,h),{depth:w,bevelEnabled:false}),[l,t,h]);

  const upright=useMemo(()=>new ExtrudeGeometry(uprightFace(w,h,stage>=4,stage>=5),{depth:t,bevelEnabled:false,curveSegments:40}),[w,h,t,stage]);

  useEffect(()=>()=>geom.dispose(),[geom]);
  useEffect(()=>()=>upright.dispose(),[upright]);

  // Mapping cross-section (x,z) extruded along -Y to world coordinates.
  return <group><SketchPlane length={l} width={w}/>{stage===0?<SketchRect length={l} width={w}/>:stage<3?<mesh position={[0,0,t/2]}><boxGeometry args={[l,w,t]}/><meshStandardMaterial color="#a8c3ce" metalness={.45} roughness={.35}/><Edges color="#d3e6ec"/></mesh>:stage===3?<mesh geometry={geom} position={[-l/2,w/2,0]} rotation={[Math.PI/2,0,0]}><meshStandardMaterial color="#aac4d0" metalness={.45} roughness={.32}/><Edges color="#cce5ed"/></mesh>:<group><mesh position={[0,0,t/2]}><boxGeometry args={[l,w,t]}/><meshStandardMaterial color="#a8c3ce" metalness={.45} roughness={.35}/><Edges color="#cce5ed"/></mesh><mesh geometry={upright} position={[-l/2,-w/2,t]} rotation={[Math.PI/2,Math.PI/2,0]}><meshStandardMaterial color="#b3d0d9" metalness={.45} roughness={.32}/><Edges color="#d6eff6" threshold={28}/></mesh></group>}
    {stage===2&&<group position={[-l/2+t/2,0,t+.1]}><SketchRect length={t} width={w}/></group>}
    {dimensions&&<><Dimension a={[-l/2,-w/2-12,0]} b={[l/2,-w/2-12,0]} label={`${l} mm`}/>{stage>0&&<Dimension a={[-l/2-10,w/2,0]} b={[-l/2-10,w/2,t]} label={`t ${t}`}/>}{stage>=3&&<Dimension a={[-l/2-12,-w/2,t]} b={[-l/2-12,-w/2,t+h]} label={`${h} mm`}/>}</>}
  </group>;

}

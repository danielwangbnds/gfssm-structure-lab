import { Suspense } from 'react';
import { Billboard, ScreenSizer, Text } from '@react-three/drei';
import type { Vector3Tuple } from 'three';

const font=`${import.meta.env.BASE_URL}assets/fonts/IBMPlexMono-Regular.ttf`;
const characters='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz +-.·Ø/';

/** GPU-rendered annotations: one scene renderer, no independent DOM roots to unmount. */
export function Label({position,text,subtle=false}:{position:Vector3Tuple;text:string;subtle?:boolean}) {
  const width=text.length*(subtle?4.3:5.4)+12;
  return <Billboard position={position}><ScreenSizer>
    {!subtle&&<mesh renderOrder={9000}><planeGeometry args={[width,19]}/><meshBasicMaterial color="#112b3b" transparent opacity={.94} depthTest={false} depthWrite={false} toneMapped={false}/></mesh>}
    <Suspense fallback={null}><Text position={[0,0,.01]} font={font} characters={characters} fontSize={subtle?7:9} anchorX="center" anchorY="middle" renderOrder={9001} color={subtle?'#61a9bc':'#b2e6ef'}>
      {text}<meshBasicMaterial depthTest={false} depthWrite={false} toneMapped={false}/>
    </Text></Suspense>
  </ScreenSizer></Billboard>;
}

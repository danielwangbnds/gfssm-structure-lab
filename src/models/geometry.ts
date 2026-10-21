import { Shape, Path, Vector2 } from 'three';

import { bracketCoordinates, habitatCoordinates } from './profiles.ts';

// A single extruded cross-section joins the base and upright without internal faces.
export function bracketProfile(length:number,thickness:number,height:number){

  return new Shape(bracketCoordinates(length,thickness,height).map(([x,y])=>new Vector2(x,y)));

}
export function uprightFace(width:number,height:number,hole:boolean,fillet:boolean){

  const r=fillet?4:0;
  const s=new Shape();
  s.moveTo(0,0);
  s.lineTo(width,0);
  s.lineTo(width,height-r);
  if(r)s.absarc(width-r,height-r,r,0,Math.PI/2,false);
  s.lineTo(r,height);
  if(r)s.absarc(r,height-r,r,Math.PI/2,Math.PI,false);
  s.lineTo(0,0);
  s.closePath();

  if(hole){
    const p=new Path();
    p.absarc(width/2,height/2,7,0,Math.PI*2,true);
    s.holes.push(p);
  }return s;

}
// Revolved radial/axial sections. Closed profiles mean a cutaway has honest cut faces.
export function habitatProfile(diameter:number,length:number,stage:number){

  return habitatCoordinates(diameter,length,stage).map(([x,y])=>new Vector2(x,y));

}

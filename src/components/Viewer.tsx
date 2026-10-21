import { Component, useEffect, useRef, useState, type ReactNode } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';

import { Grid, OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';

import { Mouse, MousePointer2, RotateCcw, Ruler, Grid2X2, Axis3D, Scissors, Crosshair } from 'lucide-react';

import { Vector3, MOUSE } from 'three';

import type { OrbitControls as Controls } from 'three-stdlib';

import type { Mission, Params } from '../types';

import { modelRegistry } from '../models';

export type ViewName='Isometric'|'Top'|'Front'|'Right';

const views:Record<ViewName,[number,number,number]>={Isometric:[1.35,-1.7,1.2],Top:[0,-.0001,1],Front:[0,-1,0],Right:[1,0,0]};

function CameraControls({view,revision,mission,onManual}:{view:ViewName;
  onManual:()=>void;
  revision:number;
  mission:string}){

  const controls=useRef<Controls>(null);
  const {camera}=useThree();
  const dest=useRef<Vector3|null>(null);
  const target=useRef(new Vector3());

  useEffect(
    ()=>{
      const center=mission==='bracket'?new Vector3(0,0,25):mission==='block'||mission==='intro'?new Vector3(0,0,10):new Vector3();
      target.current=center;
      dest.current=new Vector3(...views[view]).normalize().multiplyScalar(mission==='habitat'?290:225).add(center);
    },
      [view,revision,mission]
  );

  useFrame(
    (_,dt)=>{
      if(!dest.current||!controls.current)return;
      camera.position.lerp(dest.current,1-Math.exp(-dt*9));
      controls.current.target.lerp(target.current,1-Math.exp(-dt*9));
      controls.current.update();
      if(camera.position.distanceTo(dest.current)<.05)dest.current=null;
    }
  );

  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={.12} minDistance={30} maxDistance={650} mouseButtons={{LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:MOUSE.PAN}} onStart={()=>{
    dest.current=null;
    onManual();
  }}/>;

}
export class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};
static getDerivedStateFromError(){
  return {failed:true};
}render(){
  return this.state.failed?
    <div className="viewer-fallback">
      <h3>3D 视图未能启动</h3>
      <p>请在 Chrome / Edge 开启硬件加速，并刷新页面。教程和完成记录仍可使用。</p>
  </div>
  :this.props.children;
}}
export function Viewer({mission,params,stage,reset,instructor}:{mission:Mission;
  params:Params;
  stage:number;
  reset:()=>void;
  instructor:boolean}){

  const [view,setView]=useState<ViewName>('Isometric');
  const [freeOrbit,setFreeOrbit]=useState(false);
  const [revision,setRevision]=useState(0);
  const [grid,setGrid]=useState(true);
  const [axes,setAxes]=useState(true);
  const [dimensions,setDimensions]=useState(true);
  const [section,setSection]=useState(false);

  const Model=modelRegistry[mission.model];

  useEffect(()=>{
      setView('Isometric');
    setFreeOrbit(false);
      setSection(false);
      setRevision(v=>v+1);
    },[mission.id]);

  const resetView=()=>{
    setView('Isometric');
    setFreeOrbit(false);
    setRevision(v=>v+1);
  };

  const toggles=[
      {label:'尺寸标注',icon:Ruler,on:dimensions,action:()=>setDimensions(v=>!v)},
      {label:'参考网格',icon:Grid2X2,on:grid,action:()=>setGrid(v=>!v)},
      {label:'坐标轴',icon:Axis3D,on:axes,action:()=>setAxes(v=>!v)}
  ];

  return <section className={`viewer ${instructor?'expanded':''}`} aria-label="交互式 3D 模型">

      <div className="viewer-top">
        <div><span className="live-dot"/> LIVE MODEL <span className="viewer-divider">/</span> {mission.model==='habitat'?'HAB-01':mission.model==='bracket'?'L-BRKT':'PRIMITIVE-01'}
      </div>
        <span>UNITS: mm</span>
    </div>

      <div className="view-presets" aria-label="预设视角">{(Object.keys(views) as ViewName[]).map(v=><button key={v} className={!freeOrbit&&view===v?'active':''} aria-pressed={!freeOrbit&&view===v} onClick={()=>{
            setView(v);
            setFreeOrbit(false);
            setRevision(n=>n+1);
          }}>{v==='Isometric'?<Crosshair size={13}/>:null}{v}</button>)}</div>

      <SceneBoundary><Canvas camera={{position:[145,-190,145],up:[0,0,1],fov:42,near:.1,far:3000}} dpr={[1,1.75]} gl={{antialias:true,alpha:true}} onCreated={({gl})=>{
          gl.setClearColor('#0d1621',0);
        }}>
        <ambientLight intensity={.8}/><hemisphereLight args={['#d6efff','#2c3544',1.5]}/><directionalLight position={[80,-100,180]} intensity={3}/><directionalLight position={[-100,60,40]} intensity={1.7} color="#57bed6"/>
        {grid&&<Grid position={[0,0,mission.model==='habitat'?-params.diameter/2-.7:-.7]} rotation={[Math.PI/2,0,0]} args={[600,600]} cellSize={10} sectionSize={50} cellColor="#243442" sectionColor="#3e5665" cellThickness={.5} sectionThickness={.8} fadeDistance={500} infiniteGrid/>}
        {axes&&<axesHelper args={[65]} position={mission.model==='habitat'?[-params.length/2,0,0]:[-params.length/2,-(params.width??50)/2,0]}/>}<Model params={params} stage={stage} dimensions={dimensions} section={section}/>
        <CameraControls view={view} revision={revision} mission={mission.model} onManual={()=>setFreeOrbit(true)}/>
        {axes&&<GizmoHelper alignment="bottom-right" margin={[52,64]}><GizmoViewport axisColors={['#e77778','#91c8a9','#72b9f5']} labelColor="#09131d" hideNegativeAxes/></GizmoHelper>}
      </Canvas></SceneBoundary>

      <div className="viewer-tools">{toggles.map(
        ({label,icon:Icon,on,action})=><button key={label} className={on?'selected':''} title={label} aria-label={label} aria-pressed={on} onClick={action}><Icon size={17}/></button>
      )}<span/>{mission.model==='habitat'&&<button title="剖视图：仅改变观察方式" aria-label="剖视图" aria-pressed={section} className={section?'selected amber':''} onClick={()=>setSection(v=>!v)}><Scissors size={17}/></button>}<button title="重置视角" aria-label="重置视角" onClick={resetView}><RotateCcw size={17}/></button><button title="重置模型参数和视角" aria-label="重置模型" onClick={()=>{
          reset();
          resetView();
          setSection(false);
        }}>RESET</button>
    </div>

    {section&&mission.model==='habitat'&&
      <div className="section-note"><i/> SECTION ANALYSIS · 橙色为真实切面</div>
  }

      <div className="viewer-bottom"><span><MousePointer2 size={13}/> 左键旋转</span><span><Mouse size={13}/> 右键平移 · 滚轮缩放</span><span className="geometry-status">{(mission.model==='intro'?stage<2:mission.model==='block'?stage<3:stage===0)?'SKETCH':mission.model==='habitat'&&stage===1?'SOLID · 实心':mission.model==='habitat'&&stage>=2?'HOLLOW · 空心':'PARAMETRIC'}</span>
    </div>

  </section>
  ;

}

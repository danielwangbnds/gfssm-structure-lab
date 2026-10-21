import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei';
import { ExternalLink, Orbit, RotateCcw, X } from 'lucide-react';
import { Mesh, MeshStandardMaterial } from 'three';
import { SceneBoundary } from './Viewer';

const assetRoot = `${import.meta.env.BASE_URL}assets/`;

function Station() {
  // Keep Draco decoding entirely local; the reference works without NASA/CDN access.
  const { scene } = useGLTF(`${assetRoot}iss-nasa.glb`, `${assetRoot}draco/`);
  const {model, materials} = useMemo(() => {
    const model=scene.clone(true);
    const materials:MeshStandardMaterial[]=[];
    // The source export includes seven detached auxiliary objects above the station.
    // Hide only these named export artifacts; keep every part of the main ISS meshes.
    const auxiliary=new Set(['bendedtru1','bendedtru2','bendedtru3','bendedtrus','pCylinder1','pCylinder2','pCylinder8']);
    auxiliary.forEach(name=>model.getObjectByName(name)?.removeFromParent());
    model.traverse(object=>{
      if(object instanceof Mesh){
        const adapt=(source:MeshStandardMaterial)=>{
          const material=source.clone();
          if(material.name==='lambert7SG.001'){material.color.set('#3f6b88');material.metalness=.25;}
          materials.push(material);
          return material;
        };
        object.material=Array.isArray(object.material)?object.material.map(adapt):adapt(object.material);
      }
    });
    model.rotation.y=Math.PI/2;
    return {model, materials};
  }, [scene]);
  useEffect(()=>()=>materials.forEach(material=>material.dispose()),[materials]);
  return <Bounds fit clip observe margin={1.4}><Center><primitive object={model} dispose={null}/></Center></Bounds>;
}

export default function SpaceReference({close}:{close:()=>void}) {
  const [rotate, setRotate] = useState(false);
  const [revision, setRevision] = useState(0);
  return <div className="modal-backdrop reference-backdrop" onClick={close}>
    <section className="reference-modal" role="dialog" aria-modal="true" aria-labelledby="reference-title" onClick={e=>e.stopPropagation()}>
      <div className="reference-header">
        <div><span className="eyebrow">FIELD REFERENCE / 001</span><h2 id="reference-title">Built for life in orbit<span>.</span></h2><p>国际空间站 · 从简单几何，走向真实工程。</p></div>
        <button className="icon-button" onClick={close} aria-label="关闭航天器参考" autoFocus><X size={23}/></button>
      </div>
      <div className="reference-layout">
        <div className="reference-canvas">
          <div className="reference-label"><i className="live-dot"/> NASA ISS / 3D REFERENCE</div>
          <SceneBoundary><Canvas key={revision} camera={{position:[60,35,80],fov:42}} dpr={[1,1.5]}>
            <ambientLight intensity={1.6}/><directionalLight position={[8,12,10]} intensity={3}/><directionalLight position={[-10,3,-6]} intensity={1.4} color="#8ecfe5"/>
            <Suspense fallback={null}><Station/></Suspense>
            <OrbitControls makeDefault enableDamping autoRotate={rotate} autoRotateSpeed={.6}/>
          </Canvas></SceneBoundary>
          <div className="reference-controls"><span>左键旋转 · 右键平移 · 滚轮缩放</span><button aria-pressed={rotate} onClick={()=>setRotate(v=>!v)}><Orbit size={15}/>{rotate?'停止环绕':'自动环绕'}</button><button aria-label="重置参考视角" onClick={()=>setRevision(v=>v+1)}><RotateCcw size={15}/></button></div>
        </div>
        <div className="reference-reading">
          <span className="eyebrow">LOOK CLOSER</span><h3>你能找到哪些<br/>熟悉的形状？</h3>
          <ol><li><b>01 / 圆柱形舱段</b><p>寻找可供生活与工作的舱段。把它与 Mission 03 的圆柱轮廓比较。</p></li><li><b>02 / 桁架与连接</b><p>观察连接舱段和太阳能阵列的结构。思考：这些部件如何连接、传递载荷？</p></li><li><b>03 / 从形状到功能</b><p>选一个部件，说出它的形状、用途，以及你会先画哪一个 Sketch。</p></li></ol>
          <div className="reference-scope">此模型用于观察真实航天器外形。课程模型是适合初学者的简化练习，尺寸不对应 ISS。</div>
        </div>
      </div>
      <footer className="reference-credit"><span>3D geometry: NASA / Michael D. Carbajal · 显示经整理、配色经调整<br/>GFSSM 独立教学项目，无 NASA 背书或隶属关系。</span><a href="https://science.nasa.gov/3d-resources/international-space-station-iss-b/" target="_blank" rel="noreferrer">原始资源与署名 <ExternalLink size={13}/></a></footer>
    </section>
  </div>;
}

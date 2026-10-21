import { X } from 'lucide-react';

import { mistakes } from '../lessons';

function Diagram({type}:{type:string}){
  return <svg viewBox="0 0 120 70" aria-hidden="true">{type==='gap'?<><path d="M78 15H20V55H95V28"/><circle cx="95" cy="15" r="10" className="warn"/><path d="M91 11l8 8m-8 0l8-8" className="warn"/></>:type==='plane'?<><path d="M10 47l45-22 53 18-46 22z"/><path d="M55 25V5l53 18v20" className="warn"/><text x="24" y="49">XY</text><text x="75" y="26">XZ</text></>:type==='direction'?<><path d="M15 25h50v35H15z"/><path d="M45 10v30m-7-7l7 7 7-7"/><path d="M90 40V10m-7 7l7-7 7 7" className="warn"/></>:type==='join'?<><path d="M15 40h90v20H15zM15 40V10h20v30"/><path d="M45 23h50m-7-7l7 7-7 7"/><text x="48" y="52">1 BODY</text></>:<><path d="M20 25l45-15 35 17-45 15zM20 25v25l35 14V42m0 22l45-20V27"/><path d="M31 27l33-10 23 10-32 10z" className="face"/></>}</svg>
}
export function Mistakes({close}:{close:()=>void}){
  return <div className="modal-backdrop" onClick={close}>
      <section className="mistakes-modal" role="dialog" aria-modal="true" aria-labelledby="mistake-title" onClick={e=>e.stopPropagation()}>
        <div className="modal-heading">
          <div><span className="eyebrow">TROUBLESHOOTING</span>
            <h2 id="mistake-title">卡住了？从这里检查。</h2>
        </div>
          <button onClick={close} aria-label="关闭错误指南" autoFocus><X size={22}/></button>
      </div>
        <p>先看预览，再确认轮廓、方向与 Operation。</p>{mistakes.map(m=><article key={m.title}><Diagram type={m.diagram}/>
            <div>
              <h3>{m.title}</h3>
              <p>{m.why}</p><p className="fix">{m.fix}</p>
          </div>
        </article>)}
    </section>
  </div>
}

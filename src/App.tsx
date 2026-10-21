import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { ArrowDownToLine, ArrowLeft, ArrowRight, BookOpen, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, FlaskConical, Layers3, LockKeyhole, Maximize2, Menu, Monitor, Orbit, Play, SlidersHorizontal, Sparkles, Square, X } from 'lucide-react';

import { lessons } from './lessons';
import { Viewer } from './components/Viewer';
import { Quiz } from './components/Quiz';
import { Mistakes } from './components/Mistakes';
import { useProgress } from './hooks/useProgress';
import type { Lesson, Params } from './types';

const SpaceReference=lazy(()=>import('./components/SpaceReference'));

const defaults=(lesson:Lesson,index:number)=>Object.fromEntries(lesson.missions[index].parameters.map(p=>[p.key,p.value]));

export default function App(){

  const [lessonIndex,setLessonIndex]=useState(0);

  const lesson=lessons[lessonIndex];

  const lessonNumber=String(lessonIndex+1).padStart(2,'0');

  const challengeItems=lesson.challenge?.checklist??[];

  const [missionIndex,setMissionIndex]=useState(0);
  const [steps,setSteps]=useState<Record<string,number>>({});
  const [parameters,setParameters]=useState<Record<string,Params>>({});
  const [instructor,setInstructor]=useState(false);
  const [mistakes,setMistakes]=useState(false);
  const [reference,setReference]=useState(false);
  const [menu,setMenu]=useState(false);
  const [challenge,setChallenge]=useState(false);
  const [showHint,setShowHint]=useState(false);
  const [notice,setNotice]=useState('');
  const [lessonOpen,setLessonOpen]=useState(true);
  const {checked,toggle,storageOK}=useProgress();
  const appRef=useRef<HTMLDivElement>(null);
  const modalTrigger=useRef<HTMLElement|null>(null);
  const navRef=useRef<HTMLDivElement>(null);

  const mission=lesson.missions[missionIndex];
  const missionKey=`${lesson.id}:${mission.id}`;
  const stepIndex=steps[missionKey]??0;
  const step=mission.steps[stepIndex];
  const params=parameters[missionKey]??defaults(lesson,missionIndex);
  const key=(i:number)=>`${lesson.id}:${mission.id}:${i}`;
  const completed=lesson.missions.reduce((n,m)=>n+m.steps.filter((step,i)=>!step.optional&&checked[`${lesson.id}:${m.id}:${i}`]).length,0);
  const total=lesson.missions.reduce((n,m)=>n+m.steps.filter(step=>!step.optional).length,0);
  const percent=Math.round(completed/total*100);
  const challengeDone=challengeItems.every((_,i)=>checked[`${lesson.id}:challenge:${i}`]);

  const selectLesson=(i:number)=>{
    if(!lessons[i].available||!lessons[i].missions.length)return;
    setLessonIndex(i);
    setMissionIndex(0);
    setChallenge(false);
    setMenu(false);
    setShowHint(false);
  };

  const selectMission=(i:number)=>{
    setMissionIndex(i);
    setChallenge(false);
    setMenu(false);
    setShowHint(false);
  };
  const goStep=(i:number)=>{
    setSteps(v=>({...v,[missionKey]:i}));
    setShowHint(false);
  };
  const next=()=>{
    if(stepIndex<mission.steps.length-1)goStep(stepIndex+1);
    else if(missionIndex<lesson.missions.length-1)selectMission(missionIndex+1);
    else if(lesson.challenge)setChallenge(true);
    else setNotice('已到本课最后一步。请检查你的 Fusion 完成记录。');
  };

  useEffect(()=>{
      if(!notice)return;
      const timer=setTimeout(()=>setNotice(''),4500);
      return()=>clearTimeout(timer);
    },[notice]);

  useEffect(
    ()=>{
      const handler=(e:KeyboardEvent)=>{
        if(e.key==='Escape'){
          setMistakes(false);
          setReference(false);
          setMenu(false);
        }if(!instructor||e.target instanceof HTMLInputElement||mistakes||reference)return;
        if(e.key==='ArrowRight'){
          e.preventDefault();
          next();
        }if(e.key==='ArrowLeft'){
          e.preventDefault();
          if(challenge){setChallenge(false);goStep(mission.steps.length-1);}
          else goStep(Math.max(0,stepIndex-1));
        }
      };
      window.addEventListener('keydown',handler);
      return()=>window.removeEventListener('keydown',handler);
    },
      [instructor,stepIndex,missionIndex,mistakes,reference,lessonIndex,challenge]
  );

  useEffect(
    ()=>{
      if(!mistakes&&!reference)return;
      const previouslyFocused=modalTrigger.current;
      const oldOverflow=document.body.style.overflow;
      document.body.style.overflow='hidden';
      const handler=(e:KeyboardEvent)=>{
        if(e.key!=='Tab')return;
        const focusable=Array.from(document.querySelectorAll<HTMLElement>('.modal-backdrop button, .modal-backdrop a[href]'));
        const first=focusable[0],last=focusable.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      };
      document.addEventListener('keydown',handler);
      return()=>{
        document.removeEventListener('keydown',handler);
        document.body.style.overflow=oldOverflow;
        previouslyFocused?.focus();
      };
    },
      [mistakes,reference]
  );

  const fullscreen=async()=>{
    try{
      if(document.fullscreenElement)await document.exitFullscreen();
      else await appRef.current?.requestFullscreen();
    }catch{
      setNotice('此浏览器无法进入全屏。可使用浏览器菜单中的全屏功能。');
    }
  };

  const exportProgress=()=>{
    const content={course:lesson.title,exportedAt:new Date().toISOString(),completed,total,checked,parameters};
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(content,null,2)],{type:'application/json'}));
    a.download='gfssm-learning-progress.json';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    setNotice('学习记录已导出；实际 Fusion 模型请另存。');
  };

  return <div className={`app ${instructor?'instructor':''}`} ref={appRef}>

      <header className="topbar" inert={mistakes||reference}>
        <div className="brand"><button className="mobile-menu" aria-label="切换课程导航" aria-expanded={menu} aria-controls="course-navigation" onClick={()=>setMenu(v=>!v)}><Menu size={20}/></button>
          <div className="brand-mark"><Orbit size={25}/></div>
          <div><strong>GFSSM <span>STRUCTURE LAB</span></strong><small>SPACE DESIGN COMPETITION</small>
        </div>
      </div>
        <div className="top-course"><span>LEARNING PATH</span><ChevronRight size={13}/><b>Lesson {lessonNumber}</b>
      </div>
        <div className="top-actions">
          <div className="progress-mini"><span>YOUR PROGRESS <b>{percent}%</b></span>
            <div><i style={{width:`${percent}%`}}/></div>
        </div>
          <button className={`instructor-toggle ${instructor?'on':''}`} aria-pressed={instructor} onClick={()=>setInstructor(v=>!v)}><Monitor size={15}/><span>{instructor?'退出讲师模式':'讲师模式'}</span><i/></button><button className="icon-button" title="全屏展示" aria-label="全屏展示" onClick={fullscreen}><Maximize2 size={18}/></button>
      </div>
    </header>

      <div className="workspace" inert={mistakes||reference}>
        <aside id="course-navigation" className={`sidebar ${menu?'open':''}`}>
          <div className="department"><span className="eyebrow">STRUCTURE DEPARTMENT</span>
            <h2>Build something<br/>out of this world<span>.</span>
          </h2>
        </div>
          <nav aria-label="课程与任务"><button className="lesson-heading" onClick={()=>setLessonOpen(v=>!v)} aria-expanded={lessonOpen}><span className="lesson-num">{lessonNumber}</span><span>{lesson.title}<small>{lesson.duration??lesson.subtitle}</small></span><ChevronDown size={14} className={lessonOpen?'':'collapsed'}/></button>{lessonOpen&&
            <div className="mission-nav">{lesson.missions.map(
              (m,i)=>{
                const count=m.steps.filter((step,j)=>!step.optional&&checked[`${lesson.id}:${m.id}:${j}`]).length;
                return <button key={m.id} className={missionIndex===i&&!challenge?'active':''} onClick={()=>selectMission(i)}><span className="nav-marker">{count===m.steps.filter(step=>!step.optional).length?<Check size={13}/>:i===0?<Play size={11}/>:String(i).padStart(2,'0')}</span><span><small>{m.label}</small>{m.title}</span>{missionIndex===i&&!challenge?<span className="nav-dot"/>:null}</button>
              }
            )}{lesson.challenge&&<button className={challenge?'active challenge-link':'challenge-link'} onClick={()=>{
                setMissionIndex(lesson.missions.length-1);
                setChallenge(true);
                setMenu(false);
              }}><Sparkles size={15}/><span>Final Challenge</span>{challengeDone&&<Check size={14}/>}</button>}</div>
        }
            <div className="coming-lessons">{lessons.map(
              (l,i)=>i===lessonIndex?null:l.available?<button key={l.id} onClick={()=>selectLesson(i)}><span>{String(i+1).padStart(2,'0')}</span><p>{l.title}<small>OPEN LESSON</small></p><ArrowRight size={12}/></button>:
                <div key={l.id}><span>{String(i+1).padStart(2,'0')}</span><p>{l.title}<small>COMING SOON</small></p><LockKeyhole size={12}/>
              </div>
            )}</div>
        </nav>
          <div className="sidebar-foot">
            <div className="session-indicator"><i/> LESSON {lessonNumber} / FOUNDATIONS</div>
            <button onClick={e=>{modalTrigger.current=e.currentTarget;setReference(true);setMenu(false);}}><Orbit size={16}/> 真实航天器参考<ArrowRight size={14}/></button>
            <button onClick={e=>{modalTrigger.current=e.currentTarget;setMistakes(true);setMenu(false);}}><CircleHelp size={16}/> Beginner mistakes<ArrowRight size={14}/></button><button onClick={exportProgress}><ArrowDownToLine size={15}/> 导出学习记录</button><span>{storageOK?'进度自动保存在当前浏览器':'浏览器存储不可用，请导出进度'}</span>
        </div>
      </aside>

      {menu&&<button className="nav-scrim" aria-label="关闭课程导航" onClick={()=>setMenu(false)}/>}

        <main>
          <div className="mission-heading">
            <div>
              <div className="breadcrumb"><span>LESSON {lessonNumber}</span><span>/</span>{challenge?'FINAL CHALLENGE':mission.label}
            </div>
              <h1>{challenge?lesson.challenge?.title:mission.title}<span className="heading-dot">.</span>
            </h1>
              <p>{challenge?lesson.challenge?.subtitle:mission.subtitle}</p>
          </div>
            <span className="duration"><Clock3 size={14}/>{challenge?'10 MIN +':mission.duration}</span>
        </div>

          <div className="lab-layout">
            <div className="model-column"><Viewer mission={mission} params={params} stage={challenge?mission.steps[mission.steps.length-1].stage:step.stage} instructor={instructor} reset={()=>{
              setParameters(v=>({...v,[missionKey]:defaults(lesson,missionIndex)}));
              setNotice('模型参数已恢复默认值。');
            }}/>

              <section className="timeline">
                <div className="timeline-title"><Layers3 size={15}/><span>FEATURE TIMELINE</span><span>{challenge?'DESIGN REVIEW':`${String(stepIndex+1).padStart(2,'0')} / ${String(mission.steps.length).padStart(2,'0')}`}</span>
              </div>
                <div className="timeline-steps" ref={navRef}>{mission.steps.map(
                  (s,i)=><button key={i} aria-label={`步骤 ${i+1}：${s.title}`} title={s.command} className={!challenge&&i===stepIndex?'active':i<stepIndex?'visited':''} onClick={()=>{
                      setChallenge(false);
                      goStep(i);
                    }}><span>{checked[key(i)]?<Check size={16}/>:i===0?<Square size={16}/>:s.command.includes('Cut')?<ScissorsIcon/>:s.command.includes('Sketch')?<Square size={16}/>:<Layers3 size={16}/>}</span><small>{s.command.split(' · ')[0].split(' → ')[0]}</small></button>
                )}</div>
            </section>

              <section className="parameter-panel">
                <div className="panel-heading">
                  <div><SlidersHorizontal size={15}/><span>DESIGN PARAMETERS</span>
                </div>
                  <span>LIVE UPDATE</span>
              </div>
                <div className="sliders">{mission.parameters.map(
                  p=>
                    <label key={p.key}>
                      <div><span>{p.name}</span><strong>{params[p.key]} <small>mm</small></strong>
                    </div>
                    <input type="range" aria-label={p.name} min={p.min} max={p.max} step={p.step||1} value={params[p.key]} onChange={e=>setParameters(v=>({...v,[missionKey]:{...params,[p.key]:Number(e.target.value)}}))}/>
                      <div className="range-limits"><span>{p.min}</span><span>{p.max}</span>
                    </div>
                  </label>
                )}</div>
              <p className="parameter-note">教程使用默认尺寸。滑块用于探索变体；RESET 恢复课堂参考尺寸。</p>
              {mission.model==='habitat'&&<p className="parameter-note">壁厚 4 mm · 内径 {params.diameter-8} mm · 主舱长 {params.length} mm · {step.stage>=3||challenge?`含入口板总长 ${params.length+4} mm`:'入口板在第 4 步加入'}</p>}
            </section>

              <div className="learning-context"><FlaskConical size={17}/><p>{mission.intro}</p>
            </div>
          </div>

            <aside className="instruction-panel"><AnimatePresence mode="wait"><motion.div key={challenge?`${lesson.id}-challenge`:`${missionKey}-${stepIndex}`} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.16}}>
                {challenge?<>
                    <div className="step-kicker"><Sparkles size={16}/><span>DESIGN CHALLENGE</span>
                  </div>
                    <h2>你的设计，你来决定。</h2>
                    <p className="step-explanation">{lesson.challenge?.description}</p>
                    <div className="challenge-ideas">
                      <h3>选一个方向</h3>
                    {lesson.challenge?.ideas.map((idea,i)=><p key={idea}>{String(i+1).padStart(2,'0')} / {idea}</p>)}
                  </div>
                    <div className="expected"><span>DESIGN REVIEW</span><p>{lesson.challenge?.review}</p>
                  </div>
                    <div className="challenge-checklist">{challengeItems.map(
                      (item,i)=>
                        <label key={item}><input type="checkbox" checked={!!checked[`${lesson.id}:challenge:${i}`]} onChange={()=>toggle(`${lesson.id}:challenge:${i}`)}/><span>{item}</span>
                      </label>
                    )}</div>
                  {challengeDone&&
                    <div className="completion" role="status"><CheckCheck size={25}/>
                      <h3>{lesson.challenge?.completionTitle}</h3>
                      <p>{lesson.challenge?.completionMessage}</p>
                  </div>
                }<button className="secondary wide" onClick={()=>setChallenge(false)}><ArrowLeft size={15}/> 返回建模步骤</button></>:<>
                    <div className="step-kicker"><span className="step-number">{String(stepIndex+1).padStart(2,'0')}</span><span>CURRENT STEP {step.optional?'· OPTIONAL':''}</span><span>{stepIndex+1}/{mission.steps.length}</span>
                  </div>
                    <h2>{step.title}</h2>
                    <div className="command"><span>FUSION COMMAND</span><strong>{step.command}</strong>
                  </div>
                    <p className="step-explanation">{step.explanation}</p>
                    <div className="action-list">
                      <h3>在你的 Fusion 中操作</h3>
                      <ol>{step.actions.map((a,i)=>
                        <li key={a}><span>{String(i+1).padStart(2,'0')}</span><p>{a}</p>
                        </li>
                      )}</ol>
                  </div>
                    <div className="expected"><span><Check size={13}/> EXPECTED RESULT</span><p>{step.result}</p>
                  </div>
                    <details className="step-mistake">
                      <summary><CircleHelp size={14}/> 容易出错的地方<ChevronDown size={13}/></summary>
                      <p>{step.mistake}</p>
                  </details>
                    <button className="hint-toggle" onClick={()=>setShowHint(v=>!v)} aria-expanded={showHint}><Sparkles size={14}/>{showHint?'收起提示':'需要一点提示？'}<ChevronDown size={13}/></button>{showHint&&<p className="hint-text">{step.hint}</p>}
                    <label className={`step-check ${checked[key(stepIndex)]?'done':''}`}><input type="checkbox" checked={!!checked[key(stepIndex)]} onChange={()=>toggle(key(stepIndex))}/><span><b>{checked[key(stepIndex)]?'已在 Fusion 中完成':'我已在 Fusion 中完成这一步'}</b><small>网页预览不自动代表实际完成</small></span>
                  </label>
                    <div className="step-navigation"><button aria-label="上一步" disabled={stepIndex===0} onClick={()=>goStep(stepIndex-1)}><ArrowLeft size={17}/></button><button className="primary" onClick={next}>{stepIndex===mission.steps.length-1?(missionIndex===lesson.missions.length-1?(lesson.challenge?'进入设计挑战':'完成本课'):'下一个 Mission'):mission.model==='intro'&&stepIndex===1?'Extrude':'下一步'}<ArrowRight size={16}/></button>
                  </div>
                  {stepIndex===mission.steps.length-1&&mission.quiz&&<Quiz key={mission.id} quiz={mission.quiz}/>}</>}
              </motion.div></AnimatePresence>
              <div className="instructor-caption"><Monitor size={14}/> 讲师模式 · ← / → 切换步骤</div>
          </aside>
        </div>

          <footer className="main-footer"><span>GFSSM STRUCTURE LAB <i> / </i> LEARN BY BUILDING</span><span><BookOpen size={13}/> 辅助教材 · 请在 Autodesk Fusion 中完成实际建模</span>
        </footer>
      </main>
    </div>

    {mistakes&&<Mistakes close={()=>setMistakes(false)}/>}
    {reference&&<Suspense fallback={<div className="modal-backdrop"><p role="status">正在打开航天器参考…</p></div>}><SpaceReference close={()=>setReference(false)}/></Suspense>}<AnimatePresence>{notice&&<motion.div className="toast" role="status" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}><Check size={16}/>{notice}<button onClick={()=>setNotice('')} aria-label="关闭提示"><X size={15}/></button></motion.div>}</AnimatePresence>

  </div>
  ;

}
function ScissorsIcon(){
  return <span className="cut-icon">−</span>;
}

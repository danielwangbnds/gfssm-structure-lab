import { useState } from 'react';

import { Check, ArrowUpRight } from 'lucide-react';

import type { Mission } from '../types';

export function Quiz({quiz}:{quiz:NonNullable<Mission['quiz']>}){
  const [selected,setSelected]=useState<number|null>(null);
  return <div className="quiz"><span className="eyebrow">QUICK CHECK</span>
      <h3>{quiz.question}</h3>
      <div className="quiz-options">{quiz.options.map(
        (o,i)=><button key={o} className={selected===i?(i===quiz.answer?'correct':'incorrect'):''} onClick={()=>setSelected(i)}><span>{String.fromCharCode(65+i)}</span>{o}{selected===i&&i===quiz.answer?<Check size={15}/>:<ArrowUpRight size={14}/>}</button>
      )}</div>
    {selected!==null&&<p aria-live="polite">{selected===quiz.answer?'回答正确。':'再想一想。'}{quiz.explanation}</p>}
  </div>
}

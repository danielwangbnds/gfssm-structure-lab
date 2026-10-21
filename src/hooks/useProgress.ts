import { useEffect, useState } from 'react';

const KEY='gfssm-structure-lab:v1';

export function useProgress(){

  const [storageOK,setStorageOK]=useState(true);

  const [checked,setChecked]=useState<Record<string,boolean>>(
    ()=>{
      try{
        const v=JSON.parse(localStorage.getItem(KEY)||'{}');
        return v && typeof v==='object' && !Array.isArray(v)?Object.fromEntries(Object.entries(v).filter((entry):entry is [string,boolean]=>typeof entry[1]==='boolean')):{};
      }catch{
        return {};
      }
    }
  );

  useEffect(()=>{
      try{
        localStorage.setItem(KEY,JSON.stringify(checked));
      }catch{
        setStorageOK(false);
      }
    },[checked]);

  return {checked,storageOK,toggle:(key:string)=>setChecked(v=>({...v,[key]:!v[key]}))};

}

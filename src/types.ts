export type ModelId = 'intro' | 'block' | 'bracket' | 'habitat' | (string & {});

export type Params = Record<string, number>;

export interface Step { title:string;
command:string;
explanation:string;
actions:string[];
result:string;
mistake:string;
hint:string;
stage:number;
optional?:boolean }
export interface Parameter { key:string;
name:string;
min:number;
max:number;
value:number;
step?:number }
export interface Mission { id:string;
label:string;
title:string;
subtitle:string;
duration:string;
model:ModelId;
intro:string;
parameters:Parameter[];
steps:Step[];
quiz?:{question:string;
  options:string[];
  answer:number;
  explanation:string} }
export interface Challenge {
title:string;
subtitle:string;
description:string;
ideas:string[];

review:string;
checklist:string[];
completionTitle:string;
completionMessage:string;

}
export interface Lesson {id:string;
title:string;
subtitle:string;
duration?:string;
available:boolean;
missions:Mission[];
challenge?:Challenge}
export interface ModelProps {params:Params;
stage:number;
section:boolean;
dimensions:boolean}

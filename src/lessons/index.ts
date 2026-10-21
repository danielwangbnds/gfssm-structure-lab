import { lesson1 } from './lesson1';

import type { Lesson } from '../types';

export const lessons:Lesson[]=[
  lesson1,
  ...['Parametric Modeling','Components and Assemblies','Space Habitat Structural Design','Collaborative Space Station Project'].map((title,i)=>({id:`lesson-${i+2}`,title,subtitle:'Coming Soon',available:false,missions:[]}))
];

export const mistakes=[

    {title:'Sketch not closed',why:'轮廓有微小间隙，无法形成可拉伸区域。',fix:'进入 Edit Sketch，放大端点，用 Coincident 约束连接；确认区域填充出现。',diagram:'gap'},

    {title:'Wrong sketch plane',why:'在错误平面上绘制，拉伸方向会不同。',fix:'撤销草图并重新选择 XY / YZ / XZ；先看 Origin 坐标轴。',diagram:'plane'},

    {title:'Extrude direction incorrect',why:'箭头指向零件外部，Cut 没有与实体相交。',fix:'切换箭头方向，预览必须穿过要移除的材料。',diagram:'direction'},

    {title:'New Body instead of Join',why:'看似连接，Browser 中却有两个 Body。',fix:'在 Timeline 编辑 Extrude，将 Operation 改为 Join，并检查接触关系。',diagram:'join'},

    {title:'Unable to select a face',why:'斜角太大、选到了边或有其他物体遮挡。',fix:'先切到正视图并放大；暂时隐藏遮挡物；长按左键使用 Select Other。',diagram:'face'}
];


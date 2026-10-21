import type { ComponentType } from 'react';

import type { ModelId, ModelProps } from '../types';

import { Block } from './Block';
import { Bracket } from './Bracket';
import { Habitat } from './Habitat';

export const modelRegistry:Record<ModelId,ComponentType<ModelProps>>={intro:props=><BlockIntro {...props}/>,block:Block,bracket:Bracket,habitat:Habitat};

function BlockIntro(props:ModelProps){
  return <Block {...props} intro/>;
}

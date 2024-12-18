import { JSFunction, JSExpression } from '@gant-lowcode/lowcode-types';
export type Method = JSExpression | JSFunction & {
  source: string;
}

export interface Methods {
  [key: string]: Method;
}

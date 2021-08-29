import {
  choice,
  terminal,
  sequence,
  repeat,
  optional,
  zeroOrMore
} from 'topology-dsl';

export const path1 = sequence('c','d')._in_('a','b')._out_('e','f');
export const path2 = () => choice('c','d');
export const path3 = repeat(path2);
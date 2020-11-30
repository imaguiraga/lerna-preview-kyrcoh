import { choice, terminal, sequence, repeat, optional, zeroOrMore } from "topology-dsl-core";
export const path1 = sequence("c","d")._in_("a","b")._out_("e","f");
export const path2 = choice("c","d")._out_("e","f");
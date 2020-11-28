export const samples2 = [
  /*
`import moment from "https://unpkg.com/moment@2.29.1/moment.js";

export function test() {
  const m1 = moment().format("LLL");
  const m2 = moment().fromNow();
  return \`The moment is \${m1}, which was \${m2}\`;
}`,
// */
`import { choice, terminal, sequence} from "topology-dsl-core";
export const testflow = choice(
  terminal("a")._in_("a","b")._out_("a","b"),
  choice("e", "d"),
  sequence(
    terminal("b"), 
    terminal("c")._in_("a","b"),
    sequence("c","d")._in_("a","b")._out_("e","f")
  ),
  sequence("c","d")
);`,
`import { choice, terminal, sequence, repeat, optional, zeroOrMore } from "topology-dsl-core";
export const testflow = choice(
  terminal("a")._in_("a","b")._out_("a","b"),
  choice("e", "d"),
  sequence(
    terminal("b"),
    terminal("c")._in_("a","b"),
    sequence("c","d")._in_("a","b")._out_("e","f")
  ),
  sequence("c","d")
);

let selectClause = () => sequence("a", "b", repeat(optional("c")), zeroOrMore("d"));
let fromClause = function a() {
    return  choice("1", "2", selectClause, "4");
};

export const v1 = selectClause();
export const v2 = fromClause();
`,
`import { choice, terminal, sequence, repeat, optional, zeroOrMore } from "topology-dsl-core";
let selectClause = () => sequence("a", "b", repeat(optional("c")), zeroOrMore("d"));
let fromClause = function a() {
    return  choice("1", "2", selectClause, "4");
};

export const v1 = selectClause();
export const v2 = fromClause();
`
];
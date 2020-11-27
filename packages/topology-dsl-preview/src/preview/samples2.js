export const samples2 = [
  /*
`import moment from "https://unpkg.com/moment@2.29.1/moment.js";

export function test() {
  const m1 = moment().format("LLL");
  const m2 = moment().fromNow();
  return \`The moment is \${m1}, which was \${m2}\`;
}`,
// */
`import {choice,terminal,sequence} from "@imaguiraga/topology-dsl-core";
export const testflow = choice(
  terminal("a")._in_("a","b")._out_("a","b"),
  choice("e", "d"),
  sequence(
	terminal("b"), 
	terminal("c")._in_("a","b"),
	sequence("c","d")._in_("a","b")._out_("e","f")
  ),
  sequence("c","d")
);`
];
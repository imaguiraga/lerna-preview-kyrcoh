
export const samples = [
`let x1 = () => load("assets/json/test.json");
//let x2 = () => load("http://localhost:3000/assets/json/test1.json");
let x4 = () => load("https://raw.githubusercontent.com/imaguiraga/lerna-preview-kyrcoh/master/packages/topology-dsl-preview/public/assets/json/test1.json");
let x2 = () => load("assets/json/test1.json");
let d = choice(x1,"e", "d" ,x2);`,
`
let testflow = choice(
  terminal("a")._in_("a","b")._out_("a","b"),
  choice("e", "d"),
  sequence(terminal("b"), terminal("c")._in_("a","b"),sequence("c","d")._in_("a","b")._out_("e","f")),
  sequence("c","d")
);

let selectClause = () => sequence("a", "b", repeat(optional("c")), zeroOrMore("d"));
let fromClause = function a() {
    return  choice("1", "2", selectClause, "4");
};

//*/`,
`let selectClause = () => sequence("a", "b", repeat(optional("c")), zeroOrMore("d"));
let fromClause = function a() {
    return  choice("1", "2", selectClause, "4");
};`
];
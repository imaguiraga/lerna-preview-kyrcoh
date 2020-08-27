
export const samples = [
`let x1 = () => load("test.json");
//let x2 = () => load("http://localhost:3000/test1.json");
let x4 = () => load("https://raw.githubusercontent.com/imaguiraga/lerna-preview-kyrcoh/master/packages/topology-dsl-preview/public/test1.json");
let x2 = () => load("test1.json");
let d = choice(x1,"e", "d" ,x2);`,
`
let testflow = choice(
  terminal("a"),
  choice("e", "d"),
  sequence(terminal("b"), terminal("c"),sequence("c","d")._in_("a","b")._out_("e","f")),
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
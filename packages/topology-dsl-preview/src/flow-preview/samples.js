
export const samples = [
`let x1 = () => load("test.json");
//let x2 = () => load("http://localhost:3000/test1.json");
let x2 = () => load("test1.json");
let d = choice(x1,"e", "d" ,x2);`,
`
let testflow = choice(
  terminal("a"),
  choice("e", "d"),
  sequence(terminal("b"), terminal("c"),sequence("c","d")),
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

export const samples = [
`let testflow = choice(
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
]
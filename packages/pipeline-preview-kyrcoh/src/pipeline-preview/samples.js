
export const samples = [
`let testpipeline = pipeline(
  step("a"),
  job("e", "d","t"+"r","s","w"),
  stage(step("b"), step("c"),job("c","d")),
  job("c","d")
);

let selectClause = () => sequence("a", "b", stage(job("c")), job("d"));
let fromClause = function a() {
    return  pipeline("1", "2", selectClause, "4");
};

//*/`,
`let selectClause = () => stage("a", "b");
let fromClause = function a() {
    return  pipeline("1", "2", selectClause, "4");
};

let v = job("e", "d");
`
];
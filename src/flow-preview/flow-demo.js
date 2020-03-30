import * as flow from "../flow-dsl";
import * as diagram from "../flow-diagram";
const {
  repeat,
  sequence,
  optional,
  choice,
  zeroOrMore,
  terminal,
  FlowToG6Visitor,
  FlowUIDVisitor
} = flow;

let selectClause = () => sequence(a, b, repeat(optional("c")), zeroOrMore("d"));
let fromClause = () => choice("1", "2", selectClause, "4");

let testflow = choice(
  terminal("a"),
  choice("e", "d"),
  sequence(terminal("b"), terminal("c"),sequence("c","d")),
  sequence("c","d")
);
//*/
// Generate flow by parsing javascript text
let func = new Function("module",`const {
    repeat,
    sequence,
    optional,
    choice,
    zeroOrMore,
    terminal
  } = module;
  
  let f = choice(
    "a",
    choice("e", "d"),
    sequence(terminal("b"), terminal("c"),choice("c","d")),
    sequence("c","d")
  );
  return f;`);
try {
  testflow = func(flow);
}catch(e){
  console.error(e.name + ': ' + e.message);
}

const visitor = new FlowToG6Visitor();
const uidvisitor = new FlowUIDVisitor();
testflow = uidvisitor.visit(testflow);
const data = visitor.visit(testflow);

let graph = diagram.createFlowDiagram("container");
graph.data(data);
graph.render();

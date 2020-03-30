//var esprima = require('esprima');
//var escodegen = require("escodegen");
//import * as escodegen from 'escodegen';
import * as esprima from 'esprima';

const DEBUG = false;
export function parseDsl(input,dslModule){
  // Parse text
  // eslint-disable-next-line
  let factoryFn = new Function("module","return new Map();");
  try {
    let tree = esprima.parseScript(input);
    // Modify AST
    // Extract Identifiers
    let ids = tree.body.filter((elt) => {return elt.type === 'VariableDeclaration'})
      .map((elt) => {
        let decl = elt.declarations[0];
        let name = decl.id.name;
        let value = name;
        if(decl.init.type === "ArrowFunctionExpression" || decl.init.type === "FunctionExpression"){
          value = name+"()";
        }
        return `result.set('${name}',${value});`;
      });
      
    let text =
      `const {
        repeat,
        sequence,
        optional,
        choice,
        zeroOrMore,
        terminal,
        parallel
      } = module;

      ${input}
      
      let result = new Map();
      ${ids.join("\n")}
      return result;
    `;
    if(DEBUG) console.log(text);
    // eslint-disable-next-line
    factoryFn = new Function("module",text);

  } catch(e) {
    console.error(e.name + ': ' + e.message);
  }
  
  return factoryFn(dslModule);

}
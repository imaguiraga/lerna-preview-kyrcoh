//var esprima = require('esprima');
//var escodegen = require("escodegen");
//import * as escodegen from 'escodegen';
import * as esprima from 'esprima';
import {
  jsonToDslObject
} from "../tree";

const DEBUG = true;

function debug(msg) {
  if(DEBUG) {
    console.log(msg);
  }
}

export function parseDsl(input,dslModule){

  // Get module ids
  let MODULE_IDS = Object.keys(dslModule); 
  // Parse text
  // eslint-disable-next-line
  let factoryFn = new Function("dslModule","return new Map();");
  let variableIds = [];
  let moduleIds = [];
 
  let callbackFn = function (elt){
    // Extract Identifiers
    if(elt.type === 'VariableDeclaration'){
      let decl = elt.declarations[0];
      let name = decl.id.name;
      let value = name;

      if(decl.init.type === "ArrowFunctionExpression" || decl.init.type === "FunctionExpression") {
        value = name+"()";
      } 
      variableIds.push(`result.set('${name}',${value});`);

    } else if (elt.type === 'CallExpression'){
      let name = elt.callee.name;
      moduleIds.push(name);
    }
  };

  try {
    let tree = esprima.parseScript(input,{},callbackFn);

    // Extract call ids
    // Keep only ids in the default  
    // Remove duplicates
    moduleIds = [...new Set(moduleIds)].filter((elt) => {
      return (MODULE_IDS.indexOf(elt) >= 0);
    });

    let text =
`const {
${moduleIds.join(",\n")}
} = dslModule;

${input}

let result = new Map();
${variableIds.join("\n")}
return result;
`;
  debug(text);
    // eslint-disable-next-line
    factoryFn = new Function("dslModule",text);

  } catch(e) {
    console.error(e.name + ': ' + e.message);
  }

  return factoryFn(dslModule);

}

export function resolveImports(input){
  const result = new Promise( (resolveFn,rejectFn) => {

    const toload = new Map(); // Map of external imports to load with fetch
    // AST callback function to extract imports
    let callbackFn = function (elt){
      // Extract Identifiers
      if(elt.type === "CallExpression" && elt.callee.name === "load") {
        // Extract parameters from function name "load" 
        // Add files to load async
        let key = elt.arguments[0].value;
        toload.set(key,null);
      }
    };

    try {
      let tree = esprima.parseScript(input,{},callbackFn);
    } catch(e) {
      console.error(e.name + ': ' + e.message);
      rejectFn(e);
    }

    // Load files async
    let loadpromises = [];
    toload.forEach((value, key, map) => {
      loadpromises.push(
        fetch(key)
          .then(response => response.json())
          .then( function(data) { 
            console.log("loaded -> "+key);
            map.set(key,jsonToDslObject(data));
          })
      );
    });
    // Wait on all promises to load
    Promise.allSettled(loadpromises).then((iterable) => {
      console.log("loaded imports -> "+iterable);
      // Delegate to main promise (map of resolved imports)
      resolveFn(toload);
    })
    .catch((error) => {
      console.error('Error:', error);
      rejectFn(error);
    });

  });

  return result;

}
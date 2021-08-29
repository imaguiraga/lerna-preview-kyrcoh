/* eslint-disable no-debugger */
/* eslint-disable no-undef */
const ts = require('typescript/lib/typescriptServices.js');
require('systemjs/dist/system.js');
require('systemjs/dist/extras/global.js');
require('systemjs/dist/extras/amd.js');

//require('./systemjs-transform.js');// !important
require('systemjs/dist/extras/transform.js');// !important
// require('systemjs-babel/dist/systemjs-babel.js'); // !too slow 

// !require('systemjs/dist/extras/dynamic-import-maps.js');
// !require('systemjs/dist/extras/named-exports.js');
require('systemjs/dist/extras/named-register.js');

let DEBUG = true;

export function debugOn(v = true) {
  DEBUG = v;
}

function debug(msg) {
  if (DEBUG) {
    console.log(msg);
  }
}

const System = global.System;

const systemJSPrototype = System.constructor.prototype;

// Replaced by systemjs-babel because content-type is not available
// Hookable fetch function! require('systemjs-babel/dist/systemjs-babel.js');
const fetchOrig = systemJSPrototype.fetch;
systemJSPrototype.fetch = function (url, options) {
  return fetchOrig(url, options);
};

function transpileCode(source) {
  // https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
  // https://jsfiddle.net/k78t436y/
  // https://unpkg.com/typescript@latest/lib/typescriptServices.js
  // https://github.com/systemjs/systemjs/blob/master/docs/system-register.md transpileModule
  // Transpile code to Module
  // If code is a System or AMD module
  if (!source.startsWith('System.register') && !source.startsWith('define')) {
    // If code is not a Sytem or AMD module transpile it
    let result = ts.transpileModule(
      source,
      {
        compilerOptions: {
          module: ts.ModuleKind.System,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          esModuleInterop: true
        }
      }
    );
    debug('transpiled code:\n' + result.outputText);
    return result.outputText;
  }
  return source;
}

// Hookable transform function! provided by require('systemjs/dist/extras/transform.js');
systemJSPrototype.transform = function (_id, source) {
  if (isScript(_id)) {
    return transpileCode(source);
  }
  return source;
};

export function loadJSModule(id) {
  return System.import(id);
}

export function deregisterJSModule(id) {
  if (System.registerRegistry[id]) {
    delete System.registerRegistry[id];
  }
}

// Re-export a module with a new id
export function registerJSModule(id, _module_) {
  const exportsFn = function (exports_1) {
    'use strict';
    exports_1(_module_);
    return {
      setters: [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      execute: function () {
      }
    };
  };

  System.register(id, [], exportsFn);
  // const _define_ = [[], exportsFn];
  // System.registerRegistry[id] = _define_;
}

const EXT_REGEX = /^[^#?]+\.(tsx?|jsx?)$/;
function isScript(source) {
  return (source.indexOf('main.chunk.js') < 0) && (EXT_REGEX.test(source));
}

function importSource(id, source) {
  try {
    let result = transpileCode(source);
    debug('importSource -> ' + result);
    // Dynamically register module

    (0, eval)(result);
    // Invalidate import cache
    if (System.has(id)) {
      System.delete(id);
    }
    // Re-register the module
    // System js Module format
    System.registerRegistry[id] = System.getRegister();
    debug(System.getRegister());

  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
  return System.import(id);
}

function importURL(id, url) {
  debug('importURL -> ' + url);
  if (System.has(url)) {
    System.delete(url);
  }
  return System.import(url);
}

export function parseJSModule(moduleId, parent, loadFromCache = false) {
  let importPromise = null;
  if (loadFromCache && System.has(moduleId)) {
    importPromise = Promise.resolve(System.registerRegistry[moduleId]);
  } else {
    // Import URL
    importPromise = importURL(moduleId, parent);
  }
  return importPromise;
}

export function parseJSSourceModule(moduleId, source, loadFromCache = false) {
  let importPromise = null;
  if (loadFromCache && System.has(moduleId)) {
    importPromise = Promise.resolve(System.registerRegistry[moduleId]);
  } else {
    // Import text content
    importPromise = importSource(moduleId, source);
  }
  return importPromise;
}

// */

// ############
/*
//var esprima = require('esprima');
//var escodegen = require('escodegen');
import * as escodegen from 'escodegen';
import * as esprima from 'esprima';
export function resolveImports(input) {
  const result = new Promise((resolveFn, rejectFn) => {

    const toload = new Map(); // Map of external imports to load with fetch
    // AST callback function to extract imports
    let callbackFn = function (elt) {
      // Extract Identifiers
      if (elt.type === 'CallExpression' && elt.callee.name === 'load') {
        // Extract parameters from function name 'load'
        // Add files to load async
        let key = elt.arguments[0].value;
        toload.set(key, null);
      }
    };

    try {
      let tree = esprima.parseScript(input, {}, callbackFn);
    } catch (e) {
      console.error(e.name + ': ' + e.message);
      rejectFn(e);
    }

    // Load files async
    let loadpromises = [];
    toload.forEach((value, key, map) => {
      loadpromises.push(
        fetch(key)
          .then(response => response.json())
          .then(function (data) {
            console.log('loaded -> ' + key);
            map.set(key, jsonToDslObject(data));
          })
      );
    });
    // Wait on all promises to load
    Promise.allSettled(loadpromises).then((iterable) => {
      console.log('loaded imports -> ' + iterable);
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

export function parseDsl(input, dslModule) {

  // Get module ids
  let MODULE_IDS = Object.keys(dslModule);
  // Parse text
  // eslint-disable-next-line
  let factoryFn = new Function('dslModule', 'return new Map();');
  let variableIds = [];
  let moduleIds = [];

  let callbackFn = function (elt) {
    // Extract Identifiers
    if (elt.type === 'VariableDeclaration') {
      let decl = elt.declarations[0];
      let name = decl.id.name;
      let value = name;

      if (decl.init.type === 'ArrowFunctionExpression' || decl.init.type === 'FunctionExpression') {
        value = name + '()';
      }
      variableIds.push(`result.set('${name}',${value});`);

    } else if (elt.type === 'CallExpression') {
      let name = elt.callee.name;
      moduleIds.push(name);
    }
  };

  try {
    let tree = esprima.parseScript(input, {}, callbackFn);

    // Extract call ids
    // Keep only ids in the default
    // Remove duplicates
    moduleIds = [...new Set(moduleIds)].filter((elt) => {
      return (MODULE_IDS.indexOf(elt) >= 0);
    });

    let text =
      `const {
${moduleIds.join(',\n')}
} = dslModule;

${input}

let result = new Map();
${variableIds.join('\n')}
return result;
`;
    debug(text);
    // eslint-disable-next-line
    factoryFn = new Function('dslModule', text);

  } catch (e) {
    console.error(e.name + ': ' + e.message);
    return Promise.reject(e);
  }

  return Promise.resolve(factoryFn(dslModule));

}
// */
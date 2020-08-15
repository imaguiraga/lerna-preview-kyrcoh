import {
  TerminalResource,
  CompositeResource
} from "./resource-base.js";

export function isContainer (n) {
  return (n.children && n.children != null && n.children.length > 0) || 
  (n && n.model && n.model.compound === true);
}


export function clone(obj){
  let copy = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  return copy;
}

// This is an assign function that copies full descriptors
export function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    
    // By default, Object.assign copies enumerable Symbols, too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}
//*/

export function jsonToDslObject(o){
  let result = o;
  if(o.start === undefined){  
    if(o.compound) {
      Object.setPrototypeOf(o,CompositeResource.prototype);
    } else {
      Object.setPrototypeOf(o,TerminalResource.prototype);
    }
    if(Array.isArray(result.elts)) {
      // Recursively enrich elts
      result.elts = result.elts.map((v) => {
        return jsonToDslObject(v);
      });
    }
  }
  return result;
}

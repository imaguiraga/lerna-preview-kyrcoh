import {
  TerminalResource,
  CompositeResource
} from "./base.js";

export function isContainer (n) {
  return (n.children && n.children != null && n.children.length > 0) || 
  (n && n.model && n.model.compound === true);
}


export function clone_bak(obj){
  let copy = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  return copy;
}

// Reset ids
export function resetIds(obj,idx) {
  if(obj.id){
    // Append a suffix
    obj.id = obj.id+"_"+idx;

    if(obj._start !== null){
      obj._start.id = obj._start.id+"_"+idx;
    }
    if(obj._finish !== null){
      obj._finish.id = obj._finish.id+"_"+idx;
    }
  }
  return obj;
}

// Clone and reset ids
export function clone(obj,idx) {
  if(obj === undefined || obj === null){
    return obj;
  }
  let copy = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  // Deep copy
  if(copy.compound) {
    if(Array.isArray(copy.elts)){
      copy.elts = copy.elts.map((elt) => {
        return clone(elt,idx);
      });
    }
  }

  if(copy._start !== null){
    copy._start = clone(copy._start,idx);
  }
  if(copy._finish !== null){
    copy._finish = clone(copy._finish,idx);
  }

  return resetIds(copy,idx);
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

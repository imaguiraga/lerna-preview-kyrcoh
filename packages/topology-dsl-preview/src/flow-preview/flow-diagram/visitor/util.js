import {
  TerminalResource,
  CompositeResource
} from "@imaguiraga/topology-dsl-core";

/**
 * Class FlowToELKVisitor.
 */
export function* idGenFn(prefix,index) {
  while (index >= 0) {
    yield prefix+index;
    index++;
  }
}

let iconRegex = new RegExp("start|finish|loop|skip");
export function isIconFn (n) {
  return (n && n.model && iconRegex.test(n.model.tagName));
}

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

export function addStartFinishProperties(o){
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
        return addStartFinishProperties(v);
      });
    }
  }
  return result;
  /*

  o.isTerminal = function (){
    return this.compund;
  };

  Object.defineProperties(o, {
    'start' : {
      get: function(){
        if(this._start == null){
          return {
            resourceType: this.resourceType,
            tagName: this.tagName,
            id: this.id,
            provider: this.provider,
            compound: this.compound
          };
    
        } else {
          return this._start;
        }
      },
      set: function(val){
        this._start = val;
      }
    },
    'finish' : {
      get: function(){
        if(this._finish == null){
          return {
            resourceType: this.resourceType,
            tagName: this.tagName,
            id: this.id,
            provider: this.provider,
            compound: this.compound
          };
    
        } else {
          return this._finish;
        }
      },
      set: function(val){
        this._finish = val;
      }
    }
  });	
  //*/
}

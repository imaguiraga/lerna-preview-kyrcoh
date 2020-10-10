/**
 * idGenFn function.
 */
function* idGenFn(prefix,index) {
  while (index >= 0) {
    let reset = yield index++;
    if(reset){
        index = 0;
    }
  }
}

export const NODEIDGENFN = idGenFn("node.",0);

/**
 * Class TerminalResource.
 */
export class TerminalResource {
  /**
   * Create a TerminalResource.
   * @param {object} elts - The elts value.
   * @param {string} resourceType - The resourceType value.
   * @param {string} tagName - The tagName value.
   * @param {string} provider - The resource provider value.
   */
  constructor(elts,resourceType,tagName,provider) {
    let self = this;
    // Nex Id Generator
    self.idGenIt = NODEIDGENFN;
    self.title = "title";

    //get new id
    self.resourceType = resourceType || "terminal";
    self.subType = self.resourceType;// use for extending the resource
    self.tagName = tagName || "resource";
    self.id = self.subType + "." + this.idGenIt.next().value;
    self.provider = provider;
    self.compound = false;
    
    self._start = null;
    self._finish = null;
    self.data = new Map();
    self.link = null;
    self.name = self.id;
    self.title = self.id;

    self.elts = [];
    // Support for dataflow with input and output bindings
    self.inputElts = []; 
    self.outputElts = [];

    let r = self.resolveElt(elts); 
    if( r !== null) {
      // only one elt can be added
      self.elts.push(r);
    }
    
  }

  /**
   * Performs preorder traversal.
   * @param {(value: T, index: number, array: T[], thisArg: any) => void} callbackFn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param {Object} thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  preorder(callbackFn, i = -1, arr = [], thisArg = undefined) {
    let self = this;
    callbackFn(self,i,arr,thisArg);
    self.forEach((v,n,a) => {
      if(v.preorder){
        v.preorder(callbackFn,n,a,self);
      }
    },self);

  }

   /**
   * Performs postorder traversal.
   * @param {(value: T, index: number, array: T[], thisArg: any)) => void} callbackFn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param {Object} thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  postorder(callbackFn, i = -1, arr = [], thisArg = undefined) { 
    let self = this;
    self.forEach((v,n,a) => {
      if(v.postorder){
        v.postorder(callbackFn,n,a,self);
      }
    },self);
    callbackFn(self,i,arr,thisArg);
  }

  /**
   * Performs the specified action for each element in an array.
   * @param {(value: T, index: number, array: T[]) => void} callbackFn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param {Object} thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(callbackFn, thisArg){
    this.elts.forEach(callbackFn,thisArg);
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param {(value: T, index: number, array: T[]) => U} callbackFn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param {Object} thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   * @returns {U[]}
   */
  map(callbackFn, thisArg){
    return this.elts.map(callbackFn,thisArg);
  }

  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param {(value: T, index: number, array: T[]) => unknown} predicateFn A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param {Object} thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   * @returns {T[]}
   */
  filter(predicateFn, thisArg) {
    // Filter children
    return this.elts.filter(predicateFn,thisArg);

  }

  get start(){
    if(this._start == null){
      return {
        resourceType: this.resourceType,
        subType: this.subType,
        tagName: this.tagName,
        id: this.id,
        provider: this.provider,
        compound: this.compound
      };

    } else {
      return this._start;
    }
  }

  set start(val){
    this._start = val;
  }

  get finish(){
    if(this._finish == null){
      return {
        resourceType: this.resourceType,
        subType: this.subType,
        tagName: this.tagName,
        id: this.id,
        provider: this.provider,
        compound: this.compound
      };

    } else {
      return this._finish;
    }
  }

  set finish(val){
    this._finish = val;
  }
  
  isTerminal(){
    return true;
  }

  isGroup() {
    return (this.resourceType === "group");
  }

  resolveElt(elt){
    // Only accept primitive types as Terminal Element 
    let result = null;
    if( typeof elt !== "undefined") {
      try {
        if (typeof elt === "function") {
          result = elt.call();
        } 

        if(typeof result === "object") {
          // Allow complex element as terminal
          result = elt;

        } else {   
          // primitive
          result = elt.toString();
        }

      } catch(err){
        console.error(err.message + " - " +err);
      }
    }
    return result;
  }

  toElt(elt) {
    if (typeof elt === "function") {
      return elt.call();
    } else if (typeof elt !== "object") {
      // very likely a primitive type
      return new TerminalResource(elt,"terminal","resource",this.provider);
    }
    // default to object
    return elt;
  }

  foundElt(elt) {
    return this.id === elt.id;
  }

  accept(visitor,filterFn){
    return visitor.visit(this,filterFn);
  }

  _add_(elt) {  
    let r = this.resolveElt(elt); 
    if( r !== null) {
      // only one elt can be added
      if(this.elts.length > 0){
        this.elts.splice(0,this.elts.length);
      }
      this.elts.push(r);
    }
    
    return this;
  }

  _require_(elt) {
    let e = this.toElt(elt);
    // Add self to group elt
    if(e.isGroup()) {
      e._add_(this);
    } else {
      this._add_(elt);
    }
    return this;
  }

  _subType_(value) {
    if(value) {
      this.subType = value;
      // Replace prefix with subType
      let tmp = this.id.split("\.");
      tmp[0] = this.subType;
      this.id = tmp.join(".");
    }
    return this;
  }

  _title_(value){
    this.title = value;
    return this;
  }

  _name_(value){
    this.name = value;
    return this;
  }

  _id_(value){
    this.id = value;
    return this;
  }

  _set_(key,value) {
    this.data.set(key,value);
    return this;
  }

  _get_(key){
    return this.data.get(key);
  }

  _link_(value){
    this.link = value;
    return this;
  }

  // Add a reference 
  _ref_(elt){
    return this._add_(elt);
  }

  // Inbound bindings
  _in_(...elts){
    let self = this;
    if(Array.isArray(elts)){
      elts.forEach((e) => {
        let r = self.toElt(e);
        if( r != null) {
          self.inputElts.push(r);
        }
      });

    } else {
      let r = self.toElt(elts);
      if( r != null) {
        self.inputElts.push(r);
      }
    }
    
    return this;
  }

  // Outbound bindings
  _out_(...elts){
    let self = this;
    if(Array.isArray(elts)){
      elts.forEach((e) => {
        let r = self.toElt(e);
        if( r != null) {
          self.outputElts.push(r);
        }
      });

    } else {
      let r = self.toElt(elts);
      if( r != null) {
        self.outputElts.push(r);
      }
    }
    
    return this;
  }

  _from_(...elts) {
    return this._in_(...elts);
  }

  _to_(...elts) {
    return this._out_(...elts);
  }
}


/**
 * Class CompositeResource.
 * @extends TerminalResource
 */
export class CompositeResource extends TerminalResource {
  /**
   * Create a CompositeResource.
   * @param {object} elts - The elts value.
   * @param {string} resourceType - The resourceType value.
   * @param {string} tagName - The tagName value.
   * @param {string} provider - The resource provider value.
   */
  constructor(elts,resourceType,tagName,provider) {
    super(elts,resourceType,tagName,provider);
    let self = this;
    self.elts = [];
    self.title = null;
    self.start = new TerminalResource("start","terminal","mark",provider);
    self.finish = new TerminalResource("finish","terminal","mark",provider);
    self.compound = true;

    if(Array.isArray(elts)) {
      self.elts = elts.map(
          (elt) => { return self.resolveElt(elt); }
        ).filter( e => { return e != null; } );

    } else {
      let r = self.resolveElt(elts);
      if( r != null) {
        self.elts.push(r);
      }
    }

    if (self.title === null) {
      self.title = "" + self.id;
    }
  }

  isTerminal(){
    return false;
  }
  
  resolveElt(elt){
    return this.toElt(elt);
  }

  foundElt(elt) {
    return this.elts.filter(e => e.id === elt.id).length > 0;
  }

  _add_(...elts){
    let self = this;
    if(Array.isArray(elts)){
      elts.forEach((e) => {
        let r = self.resolveElt(e);
        if( r != null) {
          self.elts.push(r);
        }
      });

    } else {
      let r = self.resolveElt(elts);
      if( r != null) {
        self.elts.push(r);
      }
    }
    
    return this;
  }

    // Add a reference if it doesn't exist
  _ref_(...elts){
    let self = this;
    if(Array.isArray(elts)){
      elts.forEach((e) => {
        if(!self.foundElt(e)) {
          self._add_(e);
        }
      });

    } else if(!self.foundElt(elts)) {
      self._add_(elts);
    }
    
    return this;
  }
 
}

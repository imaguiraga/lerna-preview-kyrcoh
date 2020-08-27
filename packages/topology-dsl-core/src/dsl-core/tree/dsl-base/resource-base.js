/**
 * Class TerminalResource.
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
    this.idGenIt = NODEIDGENFN;

    self.title = "title";
    self.elts = [];
    // Support for dataflow with input and output bindings
    self.inboundElts = []; 
    self.outboundElts = [];

    let r = self.resolveElt(elts); 
    if( r !== null) {
      // only one elt can be added
      self.elts.push(r);
      self.title = r;
    }
    
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

  _add_(elt){  
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

  foundElt(elt) {
    return this.id === elt.id;
  }

  accept(visitor,filterFn){
    return visitor.visit(this,filterFn);
  }

  _subType_(_subType) {
    if(_subType) {
      this.subType = _subType;
      // Replace prefix with subType
      let tmp = this.id.split("\.");
      tmp[0] = this.subType;
      this.id = tmp.join(".");
    }
    return this;
  }

  _title_(_title){
    this.title = _title;
    return this;
  }

  _id_(_id){
    this.id = _id;
    return this;
  }

  _set_(key,value) {
    this.data.set(key,value);
    return this;
  }

  _get_(key){
    return this.data.get(key);
  }

  _link_(_text){
    this.link = _text;
    return this;
  }

  // Add a reference 
  _ref_(elt){
    return this._add_(elt);
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

  _in_(...elts){
    let self = this;
    if(Array.isArray(elts)){
      elts.forEach((e) => {
        let r = self.resolveElt(e);
        if( r != null) {
          self.inboundElts.push(r);
        }
      });

    } else {
      let r = self.resolveElt(elts);
      if( r != null) {
        self.inboundElts.push(r);
      }
    }
    
    return this;
  }

  _out_(...elts){
    let self = this;
    if(Array.isArray(elts)){
      elts.forEach((e) => {
        let r = self.resolveElt(e);
        if( r != null) {
          self.outboundElts.push(r);
        }
      });

    } else {
      let r = self.resolveElt(elts);
      if( r != null) {
        self.outboundElts.push(r);
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
  
  _to_(...elts) {
    return this._ref_(...elts);
  }

  _from_(...elts) {
    let self = this;
    if(Array.isArray(elts)){  
      elts.forEach((e) => {
        e._ref_(self);
      });

    } else {
      elts._ref_(self);
    }
    return this;
  }
}

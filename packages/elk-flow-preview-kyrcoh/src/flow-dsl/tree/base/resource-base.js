/**
 * Class TerminalResource.
 */
export class TerminalResource {
  static ID = 0;
  /**
   * Create a TerminalResource.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   * @param {string} resourceType - The resourceType value.
   */
  constructor(elts,ctx,tagName,resourceType) {
    let self = this;
    self.title = "title";
    self.elts = [];

    let r = self.resolveElt(elts); 
    if( r !== null) {
      // only one elt can be added
      self.elts.push(r);
      self.title = r;
    }
    
    //get new id
    TerminalResource.ID = TerminalResource.ID + 1;
    self.resourceType = resourceType;
    self.tagName = tagName || "terminal";
    self.id = self.tagName + "." + TerminalResource.ID;
    
    self.start = this;
    self.finish = this;
    self.ctx = ctx;
    self.data = new Map();
    self.link = null;
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
        result = elt.toString();

      } catch(err){
        console.error(err.message + " - " +err);
      }
    }
    return result;
  }

  add(elt){  
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

  ctx(_ctx){
    this.ctx = _ctx;
    return this;
  }

  title(_title){
    this.title = _title;
    return this;
  }

  id(_id){
    this.id = _id;
    return this;
  }

  kv(key,value) {
    this.data.set(key,value);
    return this;
  }

  get(key){
    return this.data.get(key);
  }

  link(_text){
    this.link = _text;
    return this;
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
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   * @param {string} resourceType - The resourceType value.
   */
  constructor(elts,ctx,tagName,resourceType) {
    super(elts,ctx,tagName,resourceType);
    let self = this;
    self.elts = [];
    self.title = null;
    self.start = new TerminalResource("start",null,"start",resourceType);
    self.finish = new TerminalResource("finish",null,"finish",resourceType);

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
      return new TerminalResource(elt,null,"terminal",this.resourceType);
    }
    // default to object
    return elt;
  }

  foundElt(elt) {
    return this.elts.filter(e => e.id === elt.id).length > 0;
  }

  add(elt){
    let self = this;
    if(Array.isArray(elt)){
      elt.forEach((e) => {
        let r = self.resolveElt(e);
        if( r != null) {
          self.elts.push(r);
        }
      });

    } else {
      let r = self.resolveElt(elt);
      if( r != null) {
        self.elts.push(r);
      }
    }
    
    return this;
  }
}

/**
 * Create a resource dsl tree.
 * @param {object} elt - The element.
 * @return {object} resource dsl.
 */
export function resource(elt) {
  return new TerminalResource(elt,null,"resource","resource");
}

/**
 * Create a group dsl tree.
 * @param {object} elt - The element.
 * @return {object} group dsl.
 */
export function group(elts) {
  return new CompositeResource(elts,null,"resource","resource");
}
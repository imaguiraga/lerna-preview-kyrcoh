/**
 * Class TerminalResource.
 */
function* idGenFn(prefix,index) {
  while (index >= 0) {
    yield index;
    index++;
  }
}

const IDGENFN = idGenFn("node.",0);
export class TerminalResource {
  /**
   * Create a TerminalResource.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   * @param {string} resourceType - The resourceType value.
   * @param {string} provider - The resource provider value.
   */
  constructor(elts,ctx,tagName,resourceType,provider) {
    let self = this;
    // Nex Id Generator
    this.idGenIt = IDGENFN;

    self.title = "title";
    self.elts = [];

    let r = self.resolveElt(elts); 
    if( r !== null) {
      // only one elt can be added
      self.elts.push(r);
      self.title = r;
    }
    
    //get new id
    self.resourceType = resourceType || "resource";
    self.tagName = tagName || "terminal";
    self.id = self.resourceType + "."+ self.tagName + "." + this.idGenIt.next().value;
    self.provider = provider;
    self.compound = false;
    
    self._start = null;//this;
    self._finish = null;//this;
    self.ctx = ctx;
    self.data = new Map();
    self.link = null;
  }
  
  get start(){
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
  }

  set start(val){
    this._start = val;
  }

  get finish(){
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
   * @param {string} provider - The resource provider value. 
   */
  constructor(elts,ctx,tagName,resourceType,provider) {
    super(elts,ctx,"container",resourceType,provider);
    let self = this;
    self.elts = [];
    self.title = null;
    self.start = new TerminalResource("start",null,"start",resourceType,provider);
    self.finish = new TerminalResource("finish",null,"finish",resourceType,provider);
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
      return new TerminalResource(elt,null,"terminal","resource",this.provider);
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

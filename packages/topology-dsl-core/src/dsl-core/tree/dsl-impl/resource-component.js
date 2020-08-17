import {
  CompositeResource,
  TerminalResource
} from '../dsl-base/resource-base.js';

export const RESOURCE_TYPE = "flow";

/**
 * Class ChoiceElt.
 * @extends CompositeResource
 */
export class ChoiceElt extends CompositeResource {
  /**
   * Create a ChoiceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,undefined,"choice",RESOURCE_TYPE);
  }

}

/**
 * Class FanInElt.
 * @extends CompositeResource
 */
export class FanInElt extends CompositeResource {
  /**
   * Create a FanInElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,undefined,"fan-in",RESOURCE_TYPE);
  }

}

/**
 * Class FanOutElt.
 * @extends CompositeResource
 */
export class FanOutElt extends CompositeResource {
  /**
   * Create a FanOutElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,undefined,"fan-out",RESOURCE_TYPE);
  }

}

/**
 * Class OptionalElt.
 * @extends CompositeResource
 */
export class OptionalElt extends CompositeResource{
  /**
   * Create a OptionalElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,undefined,"optional",RESOURCE_TYPE);
    
    // skip node
    this.skip = new TerminalResource("skip",null,"skip",this.resourceType,this.provider);
  }

  _add_(elt){
    // only one elt can be added
    if(this.elts.length > 0){
      this.elts.splice(0,this.elts.length);
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

/**
 * Class RepeatElt.
 * @extends CompositeResource
 */
export class RepeatElt extends CompositeResource {
  /**
   * Create a RepeatElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,undefined,"repeat",RESOURCE_TYPE);
    // loop node
    
    this.loop = new TerminalResource("loop",null,"loop",this.resourceType,this.provider);
  }

  _add_(elt){
    // only one elt can be added
    if(this.elts.length > 0){
      this.elts.splice(0,this.elts.length);
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

/**
 * Class SequenceElt.
 * @extends CompositeResource
 */
export class SequenceElt extends CompositeResource {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,undefined,"sequence",RESOURCE_TYPE);
  }

}

/**
 * Class TerminalElt.
 */
export class TerminalElt extends TerminalResource{

  /**
   * Create a TerminalElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} resourceType - The resourceType value.
   */
  constructor(elts,ctx,resourceType) {
    super(elts,ctx,"terminal",resourceType,RESOURCE_TYPE);
  }

}
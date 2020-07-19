import {
  CompositeResource,TerminalResource
} from '../base/resource-base.js';

import {FLOW_RESOURCE_TYPE} from "./flow-terminal.js";

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
    super(elts,ctx,undefined,"optional",FLOW_RESOURCE_TYPE);
    
    // skip node
    this.skip = new TerminalResource("skip",null,"skip",this.resourceType,this.provider);
  }

  add(elt){
    // only one elt can be added
    if(this.elts.length > 0){
      this.elts.splice(0,this.elts.length);
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

/**
 * Create an optional dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function optional(elt) {
  return new OptionalElt(elt);
}


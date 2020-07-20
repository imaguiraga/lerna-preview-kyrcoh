import {
  CompositeResource,TerminalResource
} from '../base/resource-base.js';

import {FLOW_RESOURCE_TYPE} from "./flow-terminal.js";

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
    super(elts,ctx,undefined,"repeat",FLOW_RESOURCE_TYPE);
    // loop node
    
    this.loop = new TerminalResource("loop",null,"loop",this.resourceType,this.provider);
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
 * Create a repeat dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function repeat(elt) {
  return new RepeatElt(elt);
}

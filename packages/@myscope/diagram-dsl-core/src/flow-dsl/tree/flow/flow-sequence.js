import {
  CompositeResource
} from '../base/resource-base.js';

import {FLOW_RESOURCE_TYPE} from "./flow-terminal.js";

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
    super(elts,ctx,undefined,"sequence",FLOW_RESOURCE_TYPE);
  }

}

/**
 * Create a sequence dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function sequence(...elts) {
  return new SequenceElt([...elts]);
}

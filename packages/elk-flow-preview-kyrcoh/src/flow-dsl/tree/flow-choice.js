import {CompositeResource,FLOW_RESOURCE_TYPE} from "./flow-terminal.js";

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
    super(elts,ctx,tagName || "choice",FLOW_RESOURCE_TYPE);
  }

}

/**
 * Create a choice dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function choice(...elts) {
  return new ChoiceElt([...elts]);
}


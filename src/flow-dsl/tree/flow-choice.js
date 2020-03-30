import {CompositeFlowElt} from "./flow-terminal.js";

/**
 * Class ChoiceElt.
 * @extends CompositeFlowElt
 */
export class ChoiceElt extends CompositeFlowElt {
  /**
   * Create a ChoiceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,tagName || "choice");
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


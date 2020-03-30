import {CompositeFlowElt} from "./flow-terminal.js";

/**
 * Class SequenceElt.
 * @extends CompositeFlowElt
 */
export class SequenceElt extends CompositeFlowElt {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,tagName ||"sequence");
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

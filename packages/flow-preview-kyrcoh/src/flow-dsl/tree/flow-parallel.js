import {CompositeResource,FLOW_RESOURCE_TYPE} from "./flow-terminal.js";

/**
 * Class ParallelElt.
 * @extends CompositeResource
 */
export class ParallelElt extends CompositeResource {
  /**
   * Create a ParallelElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,tagName || "parallel",FLOW_RESOURCE_TYPE);
  }

}

/**
 * Create a parallel dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function parallel(...elts) {
  return new ParallelElt([...elts]);
}


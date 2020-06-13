import {CompositeResource,PIPELINE_RESOURCE_TYPE} from "./pipeline-terminal.js";

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
  constructor(elts,ctx)  {
    super(elts,ctx,"container","parallel",PIPELINE_RESOURCE_TYPE);
  }

}

/**
 * Create a parallel dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} pipeline dsl.
 */
export function parallel(...elts) {
  return new ParallelElt([...elts]);
}


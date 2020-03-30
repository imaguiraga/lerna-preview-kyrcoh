import {CompositePipelineElt} from "./pipeline-terminal.js";

/**
 * Class ParallelElt.
 * @extends CompositePipelineElt
 */
export class ParallelElt extends CompositePipelineElt {
  /**
   * Create a ParallelElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName)  {
    super(elts,ctx,tagName || "parallel");
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


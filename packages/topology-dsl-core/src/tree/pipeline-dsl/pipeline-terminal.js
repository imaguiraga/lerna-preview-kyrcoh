import {
  TerminalResource
} from '../dsl-base/base.js';

export const PIPELINE_RESOURCE_TYPE = "pipeline";
/**
 * Class StepPipelineElt.
 */
export class StepPipelineElt extends TerminalResource{

  /**
   * Create a StepPipelineElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"terminal","step",PIPELINE_RESOURCE_TYPE);
  }

}

/**
 * Class DataPipelineElt.
 */
export class DataPipelineElt extends TerminalResource{

  /**
   * Create a DataPipelineElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"terminal","data",PIPELINE_RESOURCE_TYPE);
  }

}

/**
 * Create a step dsl tree.
 * @param {object} elt - The element.
 * @return {object} pipeline dsl.
 */
export function step(elt) {
  return new StepPipelineElt(elt);
}

/**
 * Create a data dsl tree.
 * @param {object} elt - The element.
 * @return {object} pipeline dsl.
 */
export function data(elt) {
  return new DataPipelineElt(elt);
}
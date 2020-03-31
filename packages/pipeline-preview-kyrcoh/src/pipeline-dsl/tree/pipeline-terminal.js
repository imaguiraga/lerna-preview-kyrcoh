import {
  TerminalResource,
  CompositeResource
} from './base/resource-base.js';

const FLOW_RESOURCE_TYPE = "pipeline";
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
    super(elts,ctx,"step",FLOW_RESOURCE_TYPE);
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
    super(elts,ctx,"data",FLOW_RESOURCE_TYPE);
  }

}


/**
 * Class CompositePipelineElt.
 * @extends CompositeResource
 */
export class CompositePipelineElt extends CompositeResource {
  /**
   * Create a CompositePipelineElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} tagName - The tagName value.
   */
  constructor(elts,ctx,tagName) {
    super(elts,ctx,tagName,FLOW_RESOURCE_TYPE);
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
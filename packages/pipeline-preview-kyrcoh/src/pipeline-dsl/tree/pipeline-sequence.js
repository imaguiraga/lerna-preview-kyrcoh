import {CompositePipelineElt} from "./pipeline-terminal.js";

/**
 * Class SequenceElt.
 * @extends CompositePipelineElt
 */
export class SequenceElt extends CompositePipelineElt {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"sequence");
  }

}

/**
 * Create a Sequence dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} pipeline dsl.
 */
export function sequence(...elts) {
  return new SequenceElt([...elts]);
}

/**
 * Create a Pipeline dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} pipeline dsl.
 */
export function pipeline(...elts) {
  return new SequenceElt([...elts]);
}


/**
 * Class JobElt.
 * @extends CompositePipelineElt
 */
export class JobElt extends CompositePipelineElt {
  /**
   * Create a JobElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"job");
  }

}

/**
 * Create a Job dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} pipeline dsl.
 */
export function job(...elts) {
  return new JobElt([...elts]);
}

/**
 * Class StageElt.
 * @extends CompositePipelineElt
 */
export class StageElt extends CompositePipelineElt {
  /**
   * Create a StageElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"stage");
  }

}

/**
 * Create a Stage dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} pipeline dsl.
 */
export function stage(...elts) {
  return new StageElt([...elts]);
}
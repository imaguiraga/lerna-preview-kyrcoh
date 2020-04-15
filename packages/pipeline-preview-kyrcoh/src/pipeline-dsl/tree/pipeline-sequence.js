import {CompositeResource,PIPELINE_RESOURCE_TYPE} from "./pipeline-terminal.js";

/**
 * Class SequenceElt.
 * @extends CompositeResource
 */
export class SequenceElt extends CompositeResource {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"sequence",PIPELINE_RESOURCE_TYPE);
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
 * Class PipelineElt.
 * @extends CompositeResource
 */
export class PipelineElt extends CompositeResource {
  /**
   * Create a PipelineElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"pipeline",PIPELINE_RESOURCE_TYPE);
  }

}
/**
 * Create a Pipeline dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} pipeline dsl.
 */
export function pipeline(...elts) {
  return new PipelineElt([...elts]);
}


/**
 * Class JobElt.
 * @extends CompositeResource
 */
export class JobElt extends CompositeResource {
  /**
   * Create a JobElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"job",PIPELINE_RESOURCE_TYPE);
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
 * @extends CompositeResource
 */
export class StageElt extends CompositeResource {
  /**
   * Create a StageElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   */
  constructor(elts,ctx) {
    super(elts,ctx,"stage",PIPELINE_RESOURCE_TYPE);
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
import {
    TerminalResource
} from './base/resource-base.js';

export * from './base/resource-base.js';
export const FLOW_RESOURCE_TYPE = "flow";
/**
 * Class TerminalFlowElt.
 */
export class TerminalFlowElt extends TerminalResource{

  /**
   * Create a TerminalFlowElt.
   * @param {object} elts - The elts value.
   * @param {object} ctx - The ctx value.
   * @param {string} resourceType - The resourceType value.
   */
  constructor(elts,ctx,resourceType) {
    super(elts,ctx,"terminal",resourceType,FLOW_RESOURCE_TYPE);
  }

}


/**
 * Create a terminal dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function terminal(elt) {
  return new TerminalFlowElt(elt);
}

/**
 * Create a state dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function state(elt) {
  return new TerminalFlowElt(elt);
}
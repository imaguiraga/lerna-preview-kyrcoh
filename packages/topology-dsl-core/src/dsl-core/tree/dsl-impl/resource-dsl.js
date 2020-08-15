import {
  ChoiceElt,
  FanInElt,
  FanOutElt,
  OptionalElt,
  RepeatElt,
  SequenceElt,
  TerminalElt
} from "./resource-component";

import {
  CompositeResource,
  TerminalResource
} from '../dsl-base/resource-base.js';

/**
 * Create a choice dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function choice(...elts) {
  return new ChoiceElt([...elts]);
}

/**
 * Create a fanIn dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function fanIn(...elts) {
  return new FanInElt([...elts]);
}

export function merge(...elts) {
  return fanIn(...elts)._subType_("merge");
}

/**
 * Create a fanOut dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function fanOut(...elts) {
  return new FanOutElt([...elts]);
}

export function branch(...elts) {
  return fanOut(...elts)._subType_("branch");
}

export function split(...elts) {
  return fanOut(...elts)._subType_("split");
}

export function tree(...elts) {
  return fanOut(...elts)._subType_("tree");
}

export function link(...elts) {
  return fanOut(...elts)._subType_("link");
}

export function use(...elts) {
  return fanOut(...elts)._subType_("use");
}

export function parallel(...elts) {
  return fanOut(...elts)._subType_("parallel");
}

/**
 * Create an optional dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function optional(elt) {
  return new OptionalElt(elt);
}

/**
 * Create a repeat dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function repeat(elt) {
  return new RepeatElt(elt);
}

/**
 * Create a sequence dsl tree.
 * @param {array|object} elts - The elements.
 * @return {object} flow dsl.
 */
export function sequence(...elts) {
  return new SequenceElt([...elts]);
}

/**
 * Create a terminal dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function terminal(elt) {
  return new TerminalElt(elt);
}

/**
 * Create a state dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function state(elt) {
  return new TerminalElt(elt);
}

/**
 * Create a zeroOrMore dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function zeroOrMore(elt) {
  return optional(repeat(elt));
}

/**
 * Create a resource dsl tree.
 * @param {object} elt - The element.
 * @return {object} resource dsl.
 */
export function resource(elt) {
  return new TerminalResource(elt,null,"terminal","resource","base");
}


/**
 * Create a group dsl tree.
 * @param {object} elt - The element.
 * @return {object} group dsl.
 */
export function group(...elts) {
  return new CompositeResource([...elts],null,"container","group","base");
}

// pipeline -> stages -> jobs -> tasks -> steps 
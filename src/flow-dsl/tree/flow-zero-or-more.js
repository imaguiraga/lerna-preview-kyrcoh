import {optional} from "./flow-optional.js"
import {repeat} from "./flow-repeat.js"

/**
 * Create a zeroOrMore dsl tree.
 * @param {object} elt - The element.
 * @return {object} flow dsl.
 */
export function zeroOrMore(elt) {
  return optional(repeat(elt));
}
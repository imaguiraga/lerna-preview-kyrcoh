import {
  CompositeResource,
  TerminalResource
} from '../dsl-base/base.js';

export const DEFAULT_TAG = "flow";

/**
 * Class FanInFanOutElt.
 * @extends CompositeResource
 */
export class FanOutFanInElt extends CompositeResource {
  /**
   * Create a FanOutFanInElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts)  {
    super(elts,"fanOut_fanIn",DEFAULT_TAG,"default");
  }

}

/**
 * Class FanInElt.
 * @extends CompositeResource
 */
export class FanInElt extends CompositeResource {
  /**
   * Create a FanInElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts)  {
    super(elts,"fanIn",DEFAULT_TAG,"default");
  }


}

/**
 * Class FanOutElt.
 * @extends CompositeResource
 */
export class FanOutElt extends CompositeResource {
  /**
   * Create a FanOutElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts)  {
    super(elts,"fanOut",DEFAULT_TAG,"default");
  }

}

/**
 * Class OptionalElt.
 * @extends CompositeResource
 */
export class OptionalElt extends CompositeResource{
  /**
   * Create a OptionalElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts)  {
    super(elts,"optional",DEFAULT_TAG,"default");
    // skip node
    this.skip = (new TerminalResource("skip","terminal","mark",this.provider))._subType_("skip");
  }

  _add_(elt){
    // only one elt can be added
    if(this.elts.length > 0){
      this.elts.splice(0,this.elts.length);
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

/**
 * Class RepeatElt.
 * @extends CompositeResource
 */
export class RepeatElt extends CompositeResource {
  /**
   * Create a RepeatElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts) {
    super(elts,"repeat",DEFAULT_TAG,"default");
    // loop node
    this.loop = (new TerminalResource("loop","terminal","mark",this.provider))._subType_("repeat");
  }

  _add_(elt){
    // only one elt can be added
    if(this.elts.length > 0){
      this.elts.splice(0,this.elts.length);
    }
    this.elts.push(this.resolveElt(elt));
    return this;
  }
}

/**
 * Class SequenceElt.
 * @extends CompositeResource
 */
export class SequenceElt extends CompositeResource {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts) {
    super(elts,"sequence",DEFAULT_TAG,"default");
  }

}

/**
 * Class TerminalElt.
 */
export class TerminalElt extends TerminalResource{

  /**
   * Create a TerminalElt.
   * @param {object} elt - The elt value.
   */
  constructor(elt) {
    super(elt,"terminal",DEFAULT_TAG,"default");
  }

}

/**
 * Class GroupElt.
 * @extends CompositeResource
 */
export class GroupElt extends CompositeResource {
  /**
   * Create a SequenceElt.
   * @param {object} elts - The elts value.
   */
  constructor(elts) {
    super(elts,"group","container","default");
  }

}
import {
  isIconFn,
  isDefaultResourceFn
} from './util.js';

import {
  isContainer
} from '@imaguiraga/topology-dsl-core';

const UNIT = 8;
export class ELKDimensionVisitor {
  constructor(
    nodeWidth = (10 * UNIT),
    nodeHeight = (8 * UNIT),
    iconWidth = (2 * UNIT),
    portSize = UNIT,
    labelHeight = (2 * UNIT)
  ) {
    this._nodeWidth = nodeWidth;
    this._nodeHeight = nodeHeight;
    this._iconWidth = iconWidth;
    this._portSize = portSize;
    this._labelHeight = labelHeight;
  }

  nodeWidth(value) {
    if (value !== undefined & value !== null) {
      this._nodeWidth = value;
    }
    return this;
  }

  nodeHeight(value) {
    if (value !== undefined & value !== null) {
      this._nodeHeight = value;
    }
    return this;
  }

  labelHeight(value) {
    if (value !== undefined & value !== null) {
      this._labelHeight = value;
    }
    return this;
  }

  iconWidth(value) {
    if (value !== undefined & value !== null) {
      this._iconWidth = value;
    }
    return this;
  }

  portSize(value) {
    if (value !== undefined & value !== null) {
      this._portSize = value;
    }
    return this;
  }

  visit(root) {
    const stack = [root];
    // FIFO
    let i = 0;
    while (i < stack.length) {
      let tree = stack[i]; i++;
      // Reset dimensions
      if (tree === undefined || tree === null) {
        return null;
      }
      if (tree.width !== undefined) {
        delete tree.width;
      }
      if (tree.height !== undefined) {
        delete tree.height;
      }
      if (tree.x !== undefined) {
        delete tree.x;
      }
      if (tree.y !== undefined) {
        delete tree.y;
      }

      // Set Node dimensions
      if (isContainer(tree)) {
        // Set node properties
        tree.properties = {
          'nodeLabels.placement': '[H_LEFT, V_TOP, OUTSIDE]'
        };

      } else {
        // Terminal Nodes dimensions
        const tagName = tree.model.tagName;
        const style = (tree.model.data !== undefined) ? tree.model.data.style : null;
        if (tagName === 'port' || tagName === 'start' || tagName === 'finish') {
          tree.width = 2 * this._portSize;
          tree.height = 2 * this._portSize;

        } else if (tagName === 'mark') {
          tree.width = 4 * this._portSize;
          tree.height = 2 * this._portSize;

        } else {
          tree.width = 2 * this._nodeWidth;
          tree.height = this._nodeHeight;
          // Nodes with no style 
          if (style === undefined || style === null) {
            let len = tree.model.title.length;
            // Pt to Px 4/3
            let w = Math.floor((len * UNIT * 2) / 3 + 6 * UNIT);
            tree.width = w;
            // How many lines
            let nl = tree.model.title.split('\n').length;
            let h = Math.floor(nl * UNIT * 4 / 3) + 4 * UNIT;
            tree.height = h;

          }
        }
      }

      // Set port dimensions
      if (Array.isArray(tree.ports)) {
        tree.ports.forEach((p) => {
          p.width = this._portSize;
          p.height = this._portSize;
        }, this);

      }

      // Set label dimensions
      if (Array.isArray(tree.labels)) {
        tree.labels.forEach((l) => {
          l.height = 2 * this._labelHeight;
          //l.width = 3 * this._nodeWidth;
        }, this);
      }

      if (Array.isArray(tree.children)) {
        tree.children.forEach((n) => {
          //this.visit(n);
          stack.push(n);
        }, this);
      }
    }
    return root;
  }

}
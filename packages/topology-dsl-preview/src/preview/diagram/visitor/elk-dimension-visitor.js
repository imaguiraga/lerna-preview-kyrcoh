import {
  isIconFn,
  isDefaultResourceFn
} from './util.js';

import {
  isContainer
} from '@imaguiraga/topology-dsl-core';

const fontSize = 16;
const padding = 8;
export class ELKDimensionVisitor {
  constructor(nodeWidth, nodeHeight, iconWidth, portSize, labelHeight) {
    this._nodeWidth = nodeWidth || 80;
    this._nodeHeight = nodeHeight || 60;
    this._iconWidth = iconWidth || fontSize;
    this._portSize = portSize || fontSize / 2;
    this._labelHeight = labelHeight || fontSize;
  }

  nodeWidth(value) {
    this._nodeWidth = value;
    return this;
  }

  nodeHeight(value) {
    this._nodeHeight = value;
    return this;
  }

  labelHeight(value) {
    this._labelHeight = value;
    return this;
  }

  iconWidth(value) {
    this._iconWidth = value;
    return this;
  }

  portSize(value) {
    this._portSize = value;
    return this;
  }

  visit(tree) {
    // Reset dimensions
    if (typeof tree === 'undefined' || tree === null) {
      return null;
    }
    if (tree.width) {
      delete tree.width;
    }
    if (tree.height) {
      delete tree.height;
    }
    if (tree.x) {
      delete tree.x;
    }
    if (tree.y) {
      delete tree.y;
    }

    // Set Node dimensions
    if (isContainer(tree)) {
      // Set node properties
      tree.properties = {
        'nodeLabels.placement': '[H_LEFT, V_TOP, INSIDE]',
        'portAlignment.default': 'CENTER',
        'portConstraints': 'FREE'
      };

    } else {
      tree.width = this._nodeWidth;
      tree.height = this._nodeHeight;
      if (isDefaultResourceFn(tree)) {
        if (isIconFn(tree)) {
          // Set start + finish to icon size
          tree.width = this._iconWidth;
          tree.height = tree.width;
        } else if (tree.inbound || tree.outbound) {
          tree.width = tree.width / 2;
          tree.height = tree.height / 2;
        }
      } else {
        if(tree.model.tagName === 'port') {
          tree.width = this._portSize;
          tree.height = tree.width;
        } else {
          tree.width = 3 * tree.width;
        }
      }
      // Set node properties
      tree.properties = {
        'nodeLabels.placement': '[H_LEFT, V_TOP, OUTSIDE]',
        'portAlignment.default': 'CENTER',
        'portConstraints': 'FREE'
      };//*/
    }

    // Set port dimensions
    if (Array.isArray(tree.ports)) {
      tree.ports.forEach((p) => {
        p.width = this._portSize;
        p.height = p.width;
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
        this.visit(n);
      }, this);
    }

    return tree;
  }

}
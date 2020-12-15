import {
  isIconFn
} from "./util.js";

import {
  isContainer
} from "@imaguiraga/topology-dsl-core";

export class ELKDimensionVisitor {
  constructor(nodeWidth, nodeHeight, iconWidth, portSize, labelHeight) {
    this._nodeWidth = nodeWidth || 80;
    this._nodeHeight = nodeHeight || 60;
    this._iconWidth = iconWidth || 16;
    this._portSize = portSize || 8;
    this._labelHeight = labelHeight || 16;
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
    if (typeof tree === "undefined" || tree === null) {
      return null;
    }
    if (tree.width) delete tree.width;
    if (tree.height) delete tree.height;
    if (tree.x) delete tree.x;
    if (tree.y) delete tree.y;

    // Set Node dimensions
    if (isContainer(tree) === false) {
      tree.width = this._nodeWidth;
      tree.height = this._nodeHeight;
      if (isIconFn(tree)) {
        // Set start + finish to icon size
        tree.width = this._iconWidth;
        tree.height = tree.width;
      } else if (tree.inbound || tree.outbound) {
        tree.width = tree.width / 2;
        tree.height = tree.height / 2;
      }
      // Set node properties
      tree.properties = {
        "nodeLabels.placement": "[H_LEFT, V_BOTTOM, OUTSIDE]",
        "portAlignment.default": "CENTER",
        "portConstraints": "FREE"
      };//*/
    } else {
      // Set node properties
      tree.properties = {
        "nodeLabels.placement": "[H_LEFT, V_TOP, OUTSIDE]",
        "portAlignment.default": "CENTER",
        "portConstraints": "FREE"
      };

    }

    // Set port dimensions
    if (Array.isArray(tree.ports)) {
      tree.ports.forEach((p) => {
        p.width = this._portSize;
        p.height = p.width;
      }, this);
      // If tree is compound set 1st port 4x _portSize
      /*
      if(isContainer(tree)){
        let p = tree.ports[0];
        p.width = 4*this._portSize;
        p.height = p.width;
      }
      //*/
    }


    // Set label dimensions
    if (Array.isArray(tree.labels)) {
      tree.labels.forEach((l) => {
        l.height = this._labelHeight;
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
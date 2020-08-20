import {
  isIconFn
} from "./util.js";

import {
  isContainer
} from "@imaguiraga/topology-dsl-core";

export class ELKDimensionVisitor {
  constructor(nodeWidth,nodeHeight,iconWidth,portSize){
    this._nodeWidth = nodeWidth || 80;
    this._nodeHeight = nodeHeight || 60;
    this._iconWidth = iconWidth || 16;
    this._portSize = portSize || 8;
  }

  nodeWidth(value){
    this._nodeWidth = value;
    return this;
  }

  nodeHeight(value){
    this._nodeHeight = value;
    return this;
  }

  iconWidth(value){
    this._iconWidth = value;
    return this;
  }

  portSize(value){
    this._portSize = value;
    return this;
  }

  visit(tree){
    // Reset dimensions
    if( typeof tree === "undefined" || tree === null){
      return null;
    }
    if(tree.width) delete tree.width;
    if(tree.height) delete tree.height;
    if(tree.x) delete tree.x;
    if(tree.y) delete tree.y;
    // Add dimensions
    if(isContainer(tree) === false){
      tree.width = this._nodeWidth;
      tree.height = this._nodeHeight;
      if(isIconFn(tree)) {
        // Set start + finish to icon size
          tree.width = this._iconWidth;
          tree.height = tree.width;
      }
    } 
    
    if(Array.isArray(tree.ports)){
      tree.ports.forEach((n) => {
        n.width = this._portSize;
        n.height = this._portSize;
      },this);
    }
    
    if(Array.isArray(tree.children)){
      tree.children.forEach((n) => {
        this.visit(n);
      },this);
    }
    return tree;
  }

}
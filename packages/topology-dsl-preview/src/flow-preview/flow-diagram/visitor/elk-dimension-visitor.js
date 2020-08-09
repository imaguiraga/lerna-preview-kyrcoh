import {
  isContainer,
  isIconFn
} from "./util.js";

export class ELKDimensionVisitor {
  constructor(nodeWidth,nodeHeight,iconWidth,portWidth){
    this._nodeWidth = nodeWidth || 80;
    this._nodeHeight = nodeHeight || 60;
    this._iconWidth = iconWidth || 24;
    this._portWidth = portWidth || 8;
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

  portWidth(value){
    this._portWidth = value;
    return this;
  }

  visit(tree){
    // Add dimesions
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
        n.width = this._portWidth;
        n.height = this._portWidth;
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
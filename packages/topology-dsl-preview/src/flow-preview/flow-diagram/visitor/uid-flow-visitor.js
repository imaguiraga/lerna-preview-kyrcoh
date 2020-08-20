import {
  jsonToDslObject
} from "@imaguiraga/topology-dsl-core";
/**
 * Class FlowUIDVisitor.
 */
export class FlowUIDVisitor {
  /**
   * Create a FlowUIDVisitor.
   * @param {string} prefix - The UID prefix.
   */
  constructor(prefix){
    this._prefix = prefix || "UID";
  }

  visit(_tree,filterFn) {
    if( typeof _tree === "undefined" || _tree === null){
      return null;
    }
    let tree = _tree;

    // Add start finish properties if missing
    tree = jsonToDslObject(tree);
    return tree; // Skip UID rename
  }

  _visit_(_tree,filterFn) {
    if( typeof _tree === "undefined" || _tree === null){
      return null;
    }
    let tree = _tree;

    // Add start finish properties if missing
    tree = jsonToDslObject(tree);

    // Non terminal nodes have start and finish
    if(!tree.isTerminal()){
      tree.start.id = this._prefix + "_" + tree.subType + "_start";
      tree.finish.id = this._prefix + "_" + tree.subType + "_finish";
    }
    
    tree.elts.filter(elt => elt instanceof Object).forEach(
      (elt,index) =>  {
        // keep only terminal nodes
        let p = this._prefix.concat("_"+index);
        elt.id = p + "_" + elt.subType;
        elt.accept(new FlowUIDVisitor(p),null);
      });
    return tree;
  }

}

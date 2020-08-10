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

  visit(tree,filterFn){
    if( typeof tree === "undefined" || tree === null){
      return null;
    }
    // Non terminal nodes have start and finish
    if(!tree.isTerminal()){
      tree.start.id = this._prefix + "_" + tree.tagName + "_start";
      tree.finish.id = this._prefix + "_" + tree.tagName + "_finish";
    }
    
    tree.elts.filter(elt => elt instanceof Object).forEach(
      (elt,index) =>  {
        // keep only terminal nodes
        let p = this._prefix.concat("_"+index);
        elt.id = p + "_" + elt.tagName;
        elt.accept(new FlowUIDVisitor(p),null);
      });
    return tree;
  }

}

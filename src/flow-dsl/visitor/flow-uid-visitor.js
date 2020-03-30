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

  visit(tree,filter){
    // Non terminal nodes have start and finish
    if( tree.tagName !== "terminal"){
      tree.start.id = this._prefix + ":" + tree.tagName + ".start";
      tree.finish.id = this._prefix + ":" + tree.tagName + ".finish";
    }
    
    tree.elts.filter(elt => elt instanceof Object).forEach(
      (elt,index) =>  {
        // keep only terminal nodes
        let p = this._prefix.concat("."+index);
        elt.id = p + ":" + elt.tagName;
        elt.accept(new FlowUIDVisitor(p),null);
      });
    return tree;
  }

}

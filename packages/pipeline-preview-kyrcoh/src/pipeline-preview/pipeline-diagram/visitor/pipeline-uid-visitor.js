/**
 * Class PipelineUIDVisitor.
 */
export class PipelineUIDVisitor {
  /**
   * Create a PipelineUIDVisitor.
   * @param {string} prefix - The UID prefix.
   */
  constructor(prefix){
    this._prefix = prefix || "UID";
  }

  visit(tree,filterFn){
    if( typeof tree === "undefined"){
      return tree;
    }
    // Non terminal nodes have start and finish
    if(!tree.isTerminal()){
      tree.start.id = this._prefix + ":" + tree.tagName + ".start";
      tree.finish.id = this._prefix + ":" + tree.tagName + ".finish";
    }
    
    tree.elts.filter(elt => elt instanceof Object).forEach(
      (elt,index) =>  {
        // keep only terminal nodes
        let p = this._prefix.concat("."+index);
        elt.id = p + ":" + elt.tagName;
        elt.accept(new PipelineUIDVisitor(p),null);
      });
    return tree;
  }

}

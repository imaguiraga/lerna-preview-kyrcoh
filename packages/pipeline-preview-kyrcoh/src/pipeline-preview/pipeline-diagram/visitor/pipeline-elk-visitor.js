/**
 * Class PipelineToELKVisitor.
 */
export class PipelineToELKVisitor {
  constructor(){
    this.edgeCnt = 0;
  }
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  visit(tree,filterFn){
    let result = null;
    if( typeof tree === "undefined"){
      return result;
    }
    switch(tree.resourceType){
      case "data":
        result = TerminalPipelineToELKVisitor.visit(this,tree,filterFn);
      break;
      case "step":
        result = TerminalPipelineToELKVisitor.visit(this,tree,filterFn);
      break;
      case "job":
        result = MutltiPathToELKVisitor.visit(this,tree,filterFn,"job");
      break;
      case "stage":
        result = MutltiPathToELKVisitor.visit(this,tree,filterFn,"stage");
      break;
      case "parallel":
        result = MutltiPathToELKVisitor.visit(this,tree,filterFn,"parallel");
      break;
      case "sequence":
        result = SequenceEltFlowToELKVisitor.visit(this,tree,filterFn,"sequence");
      break;
      case "pipeline":
        result = SequenceEltFlowToELKVisitor.visit(this,tree,filterFn,"pipeline");
      break;
      default:
      break;

    }
    return result;
  }

  getNodeModel(n) {
    let r = {
      id: n.id,
      label: n.id,
      model: { 
        provider: n.provider,
        resourceType: n.resourceType,
        tagName: n.tagName,
        compound: n.compound
      },
      labels: [
        {
          text: n.id
        } 
      ],
    };
    return r;
  }

  getEdgeModel(n) {
    let r = {
      model: { 
        provider: n.provider,
        resourceType: n.resourceType,
        tagName: null
      }
    };
    return r;
  }
}

/**
 * Class SequenceEltFlowToELKVisitor.
 */
class SequenceEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @param {string} type - The dsl type. 
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn,type){
    const graph = {
      children: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== type) {
      return graph;
    }
    // start + finish nodes
    graph.children.push(visitor.getNodeModel(tree.start));
    // nodes
    if (tree.resourceType === type && tree.compound) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = visitor.getNodeModel(node);
        if (filterFn) {
          if (!filterFn(n)) {
            graph.children.push(n);
          }
        } else {
          graph.children.push(n);
        }
      });
    }
    graph.children.push(visitor.getNodeModel(tree.finish));
    // edges
    visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[i].finish.id],
        targets: [tree.elts[i + 1].start.id],
        ...visitor.getEdgeModel(tree),
      });
    }

    visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
      sources: [tree.elts[tree.elts.length - 1].finish.id],
      targets: [tree.finish.id],
      ...visitor.getEdgeModel(tree),
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        graph.children = graph.children.concat(g6.children);
        graph.edges = graph.edges.concat(g6.edges);
      }
    });

    return graph;
  }
}

/**
 * Class TerminalPipelineToELKVisitor.
 */
class TerminalPipelineToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const graph = {
      children: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };

    let n = visitor.getNodeModel(tree);
    if (filterFn) {
      if (!filterFn(n)) {
        graph.children.push(n);
      }
    } else {
      graph.children.push(n);
    }
    return graph;
  }

}

/**
 * Class MutltiPathToELKVisitor.
 */
class MutltiPathToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @param {string} type - The dsl type. 
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn,type){
    //const type = "choice" | "parallel";
    const graph = {
      children: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    //
    if (tree.resourceType !== type) {
      return graph;
    }
    // start + finish nodes
    graph.children.push(visitor.getNodeModel(tree.start));


    // nodes
    if (tree.resourceType === type && tree.compound) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = visitor.getNodeModel(node);

        if (filterFn) {
          if (!filterFn(n)) {
            graph.children.push(n);
          }
        } else {
          graph.children.push(n);
        }
      });
    }
    graph.children.push(visitor.getNodeModel(tree.finish));
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[i].start.id],
        ...visitor.getEdgeModel(tree),
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[i].finish.id],
        targets: [tree.finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        graph.children = graph.children.concat(g6.children);
        graph.edges = graph.edges.concat(g6.edges);
      }
    });

    return graph;
  }
  
}

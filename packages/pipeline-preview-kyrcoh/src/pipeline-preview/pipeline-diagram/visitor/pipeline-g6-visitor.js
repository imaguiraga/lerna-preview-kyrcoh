/**
 * Class PipelineToG6Visitor.
 */
export class PipelineToG6Visitor {
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
    switch(tree.tagName){
      case "data":
        result = TerminalPipelineToG6Visitor.visit(this,tree,filterFn);
      break;
      case "step":
        result = TerminalPipelineToG6Visitor.visit(this,tree,filterFn);
      break;
      case "job":
        result = MutltiPathToG6Visitor.visit(this,tree,filterFn,"job");
      break;
      case "stage":
        result = MutltiPathToG6Visitor.visit(this,tree,filterFn,"stage");
      break;
      case "parallel":
        result = MutltiPathToG6Visitor.visit(this,tree,filterFn,"parallel");
      break;
      case "sequence":
        result = SequenceEltFlowToG6Visitor.visit(this,tree,filterFn,"sequence");
      break;
      case "pipeline":
        result = SequenceEltFlowToG6Visitor.visit(this,tree,filterFn,"pipeline");
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
        tagName: n.tagName,
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
        tagName: n.tagName,
        tagName: null
      }
    };
    return r;
  }
}

/**
 * Class SequenceEltFlowToG6Visitor.
 */
class SequenceEltFlowToG6Visitor{
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
      nodes: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.tagName !== type) {
      return graph;
    }
    // start + finish nodes
    graph.nodes.push(visitor.getNodeModel(tree.start));
    // nodes
    if (tree.tagName === type && tree.compound) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = visitor.getNodeModel(node);
        if (filterFn) {
          if (!filterFn(n)) {
            graph.nodes.push(n);
          }
        } else {
          graph.nodes.push(n);
        }
      });
    }
    graph.nodes.push(visitor.getNodeModel(tree.finish));
    // edges
    graph.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id,
        ...visitor.getEdgeModel(tree),
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {
      graph.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.elts[i + 1].start.id,
        ...visitor.getEdgeModel(tree),
      });
    }

    graph.edges.push({
      source: tree.elts[tree.elts.length - 1].finish.id,
      target: tree.finish.id,
      ...visitor.getEdgeModel(tree),
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        graph.nodes = graph.nodes.concat(g6.nodes);
        graph.edges = graph.edges.concat(g6.edges);
      }
    });

    return graph;
  }
}

/**
 * Class TerminalPipelineToG6Visitor.
 */
class TerminalPipelineToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const graph = {
      nodes: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };

    let n = visitor.getNodeModel(tree);
    if (filterFn) {
      if (!filterFn(n)) {
        graph.nodes.push(n);
      }
    } else {
      graph.nodes.push(n);
    }
    return graph;
  }

}

/**
 * Class MutltiPathToG6Visitor.
 */
class MutltiPathToG6Visitor{
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
      nodes: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    //
    if (tree.tagName !== type) {
      return graph;
    }
    // start + finish nodes
    graph.nodes.push(visitor.getNodeModel(tree.start));


    // nodes
    if (tree.tagName === type && tree.compound) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = visitor.getNodeModel(node);

        if (filterFn) {
          if (!filterFn(n)) {
            graph.nodes.push(n);
          }
        } else {
          graph.nodes.push(n);
        }
      });
    }
    graph.nodes.push(visitor.getNodeModel(tree.finish));
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      graph.edges.push({
        source: tree.start.id,
        target: tree.elts[i].start.id,
        ...visitor.getEdgeModel(tree),
      });
      graph.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.finish.id,
        ...visitor.getEdgeModel(tree),
      });
    }
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        graph.nodes = graph.nodes.concat(g6.nodes);
        graph.edges = graph.edges.concat(g6.edges);
      }
    });

    return graph;
  }
  
}

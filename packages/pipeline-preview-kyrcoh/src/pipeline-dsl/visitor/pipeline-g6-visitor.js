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
    const g6data = {
      nodes: [],
      edges: []
    };
    if (tree.tagName !== type) {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType : tree.resourceType,  
        tagName: type+'.start'
      }
    });
    // nodes
    if (tree.tagName === type) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.title ,
          width: (node.title.length + 4) * 12,
          model: { 
            resourceType : node.resourceType,  
            tagName: type+'.terminal'
          }
        };
        if (filterFn) {
          if (!filterFn(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }
    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: { 
        resourceType : tree.resourceType,  
        tagName: type+'.finish'
      }
    });
    // edges
    g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.elts[i + 1].start.id
      });
    }

    g6data.edges.push({
      source: tree.elts[tree.elts.length - 1].finish.id,
      target: tree.finish.id
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        g6data.nodes = g6data.nodes.concat(g6.nodes);
        g6data.edges = g6data.edges.concat(g6.edges);
      }
    });

    return g6data;
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
    const g6data = {
      nodes: [],
      edges: []
    };

    let n = {
      id: tree.id,
      label: tree.title ,
      width: (tree.title.length + 4) * 12,
      model: { 
        resourceType : tree.resourceType,  
        tagName: tree.tagName
      }
    };
    if (filterFn) {
      if (!filterFn(n)) {
        g6data.nodes.push(n);
      }
    } else {
      g6data.nodes.push(n);
    }
    return g6data;
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
    const g6data = {
      nodes: [],
      edges: []
    };
    //
    if (tree.tagName !== type) {
      return g6data;
    }
    // start + finish nodes
    g6data.nodes.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType : tree.resourceType,  
        tagName: type+'.start'
      }
    });

    // nodes
    if (tree.tagName === type) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.title ,
          width: (node.title.length + 4) * 12,
          model: {
            resourceType : node.resourceType,   
            tagName: type+'.terminal'
          }
        };

        if (filterFn) {
          if (!filterFn(n)) {
            g6data.nodes.push(n);
          }
        } else {
          g6data.nodes.push(n);
        }
      });
    }
    g6data.nodes.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: {
        resourceType : tree.resourceType,   
        tagName: type+'.finish'
      }
    });
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      g6data.edges.push({
        source: tree.start.id,
        target: tree.elts[i].start.id
      });
      g6data.edges.push({
        source: tree.elts[i].finish.id,
        target: tree.finish.id
      });
    }
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        g6data.nodes = g6data.nodes.concat(g6.nodes);
        g6data.edges = g6data.edges.concat(g6.edges);
      }
    });

    return g6data;
  }
  
}

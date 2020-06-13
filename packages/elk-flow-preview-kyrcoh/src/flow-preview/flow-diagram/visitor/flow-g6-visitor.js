/**
 * Class FlowToG6Visitor.
 */
export class FlowToG6Visitor {
  /**
   * Convert a dsl tree to g6 Graph.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 graph.
   */
  visit(tree,filterFn){
    let result = null;
    if( typeof tree === "undefined"){
      return result;
    }
    if(tree.compound) {
      switch(tree.resourceType){
        case "choice":
          result = this._visitChoice(tree,filterFn);
        break;
        case "optional":
          result = this._visitOptional(tree,filterFn);
        break;
        case "sequence":
          result = this._visitSequence(tree,filterFn);
        break;
        case "repeat":
          result = this._visitRepeat(tree,filterFn);
        break;
        case "parallel":
          result = this._visitParallel(tree,filterFn);
        break;
        case "terminal":
          result = this._visitTerminal(tree,filterFn);
        break;
        default:
        break;
      } 

    } else {
      result = this._visitTerminal(tree,filterFn);
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

  _visitSequence(tree,filterFn){
    return SequenceEltFlowToG6Visitor.visit(this,tree,filterFn);
  }

  _visitChoice(tree,filterFn){
    return MutltiPathEltFlowToG6Visitor.visit(this,tree,filterFn,"choice");
  }

  _visitParallel(tree,filterFn){
    return MutltiPathEltFlowToG6Visitor.visit(this,tree,filterFn,"parallel");
  }

  _visitOptional(tree,filterFn){
    return OptionalEltFlowToG6Visitor.visit(this,tree,filterFn);
  }

  _visitRepeat(tree,filterFn){
    return RepeatEltFlowToG6Visitor.visit(this,tree,filterFn);
  }

  _visitTerminal(tree,filterFn){
    return TerminalFlowEltFlowToG6Visitor.visit(this,tree,filterFn);
  }
}

/**
 * Class TerminalFlowEltFlowToG6Visitor.
 */
class TerminalFlowEltFlowToG6Visitor{
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
 * Class SequenceEltFlowToG6Visitor.
 */
class SequenceEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn) {
    const SEQUENCE = "sequence";
    const graph = {
      nodes: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== SEQUENCE) {
      return graph;
    }
    // start + finish nodes
    graph.nodes.push(visitor.getNodeModel(tree.start));
    // nodes
    if (tree.resourceType === SEQUENCE && tree.compound) {
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
 * Class MutltiPathEltFlowToG6Visitor.
 */
class MutltiPathEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
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
    if (tree.resourceType !== type) {
      return graph;
    }
    // start + finish nodes
    graph.nodes.push(visitor.getNodeModel(tree.start));
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

/**
 * Class OptionalEltFlowToG6Visitor.
 */
class OptionalEltFlowToG6Visitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn) {
    const OPTIONAL = "optional";
    const graph = {
      nodes: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== OPTIONAL) {
      return graph;
    }
    // start node
    graph.nodes.push(visitor.getNodeModel(tree.start));

    // skip node
    if(tree.skip) {
      graph.nodes.push(visitor.getNodeModel(tree.skip));
    }

    // nodes
    if (tree.resourceType === OPTIONAL && tree.compound) {
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

    if(tree.elts.length > 0) {
      graph.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id,
        ...visitor.getEdgeModel(tree),
      });
      graph.edges.push({
        source: tree.elts[tree.elts.length-1].finish.id,
        target: tree.finish.id,
        ...visitor.getEdgeModel(tree),
      });
    }

    // start -> skip? -> finish
    if(typeof(tree.skip) !== "undefined"){
      graph.edges.push({
        source: tree.start.id,
        target: tree.skip.id,
        ...visitor.getEdgeModel(tree),
      });
      graph.edges.push({
        source: tree.skip.id,
        target: tree.finish.id,
        ...visitor.getEdgeModel(tree),
      });
    } else {
      graph.edges.push({
        source: tree.start.id,
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

/**
 * Class RepeatEltFlowToG6Visitor.
 */
class RepeatEltFlowToG6Visitor {
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const REPEAT = "repeat";
    const graph = {
      nodes: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== REPEAT) {
      return graph;
    }
    // start node
    graph.nodes.push(visitor.getNodeModel(tree.start));

    // loop node
    if(tree.loop) {
      graph.nodes.push(visitor.getNodeModel(tree.loop));
    }
    // nodes
    if (tree.resourceType === REPEAT && tree.compound) {
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

    // finish node
    graph.nodes.push(visitor.getNodeModel(tree.finish));
    // edges
    if(tree.elts.length > 0) {
      graph.edges.push({
        source: tree.start.id,
        target: tree.elts[0].start.id,
        ...visitor.getEdgeModel(tree),
      });
      graph.edges.push({
        source: tree.elts[tree.elts.length-1].finish.id,
        target: tree.finish.id,
        ...visitor.getEdgeModel(tree),
      });
    }

    // start <- loop <- finish
    // reverse the arrow direction
    if(typeof(tree.loop) !== "undefined"){
      graph.edges.push({
        source: tree.start.id,
        target: tree.loop.id,
        style: {
          startArrow: true,
          endArrow: false,
        },
        ...visitor.getEdgeModel(tree),
      });
      graph.edges.push({
        source: tree.loop.id,
        target: tree.finish.id,
        style: {
          startArrow: true,
          endArrow: false,
        },
        ...visitor.getEdgeModel(tree),
      });
    } else {
      graph.edges.push({
        source: tree.finish.id,
        target: tree.start.id,
        ...visitor.getEdgeModel(tree),
      });
    }
    //*/
    
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
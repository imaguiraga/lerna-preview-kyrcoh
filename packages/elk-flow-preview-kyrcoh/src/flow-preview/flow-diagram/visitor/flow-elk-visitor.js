/**
 * Class FlowToELKVisitor.
 */
export class FlowToELKVisitor {
  constructor(){
    this.edgeCnt = 0;
  }
  /**
   * Convert a dsl tree to ELK Graph.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ELK graph.
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
    return SequenceEltFlowToELKVisitor.visit(this,tree,filterFn);
  }

  _visitChoice(tree,filterFn){
    return MutltiPathEltFlowToELKVisitor.visit(this,tree,filterFn,"choice");
  }

  _visitParallel(tree,filterFn){
    return MutltiPathEltFlowToELKVisitor.visit(this,tree,filterFn,"parallel");
  }

  _visitOptional(tree,filterFn){
    return OptionalEltFlowToELKVisitor.visit(this,tree,filterFn);
  }

  _visitRepeat(tree,filterFn){
    return RepeatEltFlowToELKVisitor.visit(this,tree,filterFn);
  }

  _visitTerminal(tree,filterFn){
    return TerminalFlowEltFlowToELKVisitor.visit(this,tree,filterFn);
  }
}

/**
 * Class TerminalFlowEltFlowToELKVisitor.
 */
class TerminalFlowEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph graph.
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
 * Class SequenceEltFlowToELKVisitor.
 */
class SequenceEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph graph.
   */  
  static visit(visitor,tree,filterFn) {
    const SEQUENCE = "sequence";
    const graph = {
      children: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== SEQUENCE) {
      return graph;
    }
    // start + finish nodes
    graph.children.push(visitor.getNodeModel(tree.start));
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
        ...visitor.getNodeModel(tree),
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
 * Class MutltiPathEltFlowToELKVisitor.
 */
class MutltiPathEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph graph.
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

/**
 * Class OptionalEltFlowToELKVisitor.
 */
class OptionalEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph graph.
   */  
  static visit(visitor,tree,filterFn) {
    const OPTIONAL = "optional";
    const graph = {
      children: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== OPTIONAL) {
      return graph;
    }
    // start node
    graph.children.push(visitor.getNodeModel(tree.start));

    // skip node
    if(tree.skip) {
      graph.children.push(visitor.getNodeModel(tree.skip));
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
            graph.children.push(n);
          }
        } else {
          graph.children.push(n);
        }
      });
    }
    graph.children.push(visitor.getNodeModel(tree.finish));
    // edges

    if(tree.elts.length > 0) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),

      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[tree.elts.length-1].finish.id],
        targets: [tree.finish.id],
         ...visitor.getEdgeModel(tree),
      });
    }

    // start -> skip? -> finish
    if(typeof(tree.skip) !== "undefined"){
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.skip.id],
        ...visitor.getEdgeModel(tree),
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.skip.id],
        targets: [tree.finish.id],
        ...visitor.getEdgeModel(tree),
      });
    } else {
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
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

/**
 * Class RepeatEltFlowToELKVisitor.
 */
class RepeatEltFlowToELKVisitor {
  /**
   * Convert a dsl tree to g6 Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph graph.
   */
  static visit(visitor,tree,filterFn) {
    const REPEAT = "repeat";
    const graph = {
      children: [],
      edges: [],
      ...visitor.getNodeModel(tree)
    };
    if (tree.resourceType !== REPEAT) {
      return graph;
    }
    // start node
    graph.children.push(visitor.getNodeModel(tree.start));

    // loop node
    if(tree.loop) {
      graph.children.push(visitor.getNodeModel(tree.loop));
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
            graph.children.push(n);
          }
        } else {
          graph.children.push(n);
        }
      });
    }

    // finish node
    graph.children.push(visitor.getNodeModel(tree.finish));
    // edges
    if(tree.elts.length > 0) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[tree.elts.length-1].finish.id],
        targets: [tree.finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }

    // start <- loop <- finish
    // reverse the arrow direction
    if(typeof(tree.loop) !== "undefined"){
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.loop.id],
        style: {
          startArrow: true,
          endArrow: false,
        },
        ...visitor.getEdgeModel(tree),
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.loop.id],
        targets: [tree.finish.id],
        style: {
          startArrow: true,
          endArrow: false,
        },
        ...visitor.getEdgeModel(tree),
      });
    } else {
      visitor.edgeCnt = visitor.edgeCnt+1;
      graph.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.finish.id],
        targets: [tree.start.id],
        ...visitor.getEdgeModel(tree),
      });
    }
    //*/
    
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

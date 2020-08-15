import {
  idGenFn
} from "./util.js";

import {
  jsonToDslObject
} from "@imaguiraga/topology-dsl-core";

export class FlowToELKVisitor {
  constructor(){
    this.edgeCntIt = idGenFn("edge.",0);   
  }
  
  toElkGraph(tree,filterFn){
    return {
      id: "$root",
      children: [
        this.visit(tree,filterFn)
      ]
    };
  }
  /**
   * Convert a dsl tree to ELK Graph.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ELK graph.
   */
  visit(_tree,filterFn){
    if( typeof _tree === "undefined" || _tree === null){
      return null;
    }
    let tree = _tree;
    // Add start finish properties if missing
    tree = jsonToDslObject(tree);

    let result = null;
    if( typeof tree === "undefined"){
      return result;
    }
    if(tree.compound) {
      switch(tree.resourceType){
        case "choice":
        case "fan-in":
        case "fan-out":
        case "group":
        case "parallel":
          result = MutltiPathEltFlowToELKVisitor.visit(this,tree,filterFn,tree.resourceType);
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
          console.error("==>WARNING: " + tree.resourceType +" type was not found");
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
      ]
    };
    return r;
  }

  getPortModel(n) {
    let r = this.getNodeModel(n);
    return r;
  }

  getEdgeModel(n) {
    let r = {
      model: { 
        provider: n.provider,
        resourceType: n.resourceType,
        tagName: "edge"
      },
      style: {
        startArrow: false,
        endArrow: true,
      }
    };
    return r;
  }

  _visitSequence(tree,filterFn){
    return SequenceEltFlowToELKVisitor.visit(this,tree,filterFn);
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
      ...visitor.getNodeModel(tree),
      ports: [],
      children: [],
      edges: []  
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
      ...visitor.getNodeModel(tree),
      ports: [],
      children: [],
      edges: []  
    };
    if (tree.resourceType !== SEQUENCE) {
      return graph;
    }
    // start + finish nodes
    graph.ports.push(visitor.getPortModel(tree.start));
    graph.ports.push(visitor.getPortModel(tree.finish));
    // edges
    
    graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {   
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.elts[i].finish.id],
        targets: [tree.elts[i + 1].start.id],
        ...visitor.getEdgeModel(tree),
      });
    }
  
    graph.edges.push({
      id: `${visitor.edgeCntIt.next().value}`,
      sources: [tree.elts[tree.elts.length - 1].finish.id],
      targets: [tree.finish.id],
      ...visitor.getEdgeModel(tree),
    });
    // concatenate G6 graphs

    // nodes
    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        if (filterFn) {
          if (!filterFn(g6)) {
            graph.children.push(g6);
          }
        } else {
          graph.children.push(g6);
        }
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
      ...visitor.getNodeModel(tree),
      ports: [],
      children: [],
      edges: []  
    };
    //
    if (tree.resourceType !== type) {
      return graph;
    }
    // start + finish nodes
    graph.ports.push(visitor.getPortModel(tree.start));
    graph.ports.push(visitor.getPortModel(tree.finish));
    // edges
    // groups are just containers
    if( type !== "group") {
      for (let i = 0; i < tree.elts.length; i++) { 
        if( type !== "fan-in") {
          graph.edges.push({
            id: `${visitor.edgeCntIt.next().value}`,
            sources: [tree.start.id],
            targets: [tree.elts[i].start.id],
            ...visitor.getEdgeModel(tree),
          });
        }
        if( type !== "fan-out") {
          graph.edges.push({
            id: `${visitor.edgeCntIt.next().value}`,
            sources: [tree.elts[i].finish.id],
            targets: [tree.finish.id],
            ...visitor.getEdgeModel(tree),
          });
        }
      }
    }
    // concatenate G6 graphs
    // nodes
    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        if (filterFn) {
          if (!filterFn(g6)) {
            graph.children.push(g6);
          }
        } else {
          graph.children.push(g6);
        }
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
      ...visitor.getNodeModel(tree),
      ports: [],
      children: [],
      edges: []  
    };
    if (tree.resourceType !== OPTIONAL) {
      return graph;
    }
    // start node
    graph.ports.push(visitor.getPortModel(tree.start));

    // skip node
    if(tree.skip) {
      graph.children.push(visitor.getNodeModel(tree.skip));
    }

    graph.ports.push(visitor.getPortModel(tree.finish));
    // edges

    if(tree.elts.length > 0) {
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),

      });
      
    }

    // start -> skip? -> finish
    if(typeof(tree.skip) !== "undefined"){
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.start.id],
        targets: [tree.skip.id],
        ...visitor.getEdgeModel(tree),
      });
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.skip.id],
        targets: [tree.finish.id],
        ...visitor.getEdgeModel(tree),
      });
    } else {
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.start.id],
        targets: [tree.finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }

    if(tree.elts.length > 0) {
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.elts[tree.elts.length-1].finish.id],
        targets: [tree.finish.id],
         ...visitor.getEdgeModel(tree),
      });
    }
    // concatenate G6 graphs
    // nodes
    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        if (filterFn) {
          if (!filterFn(g6)) {
            graph.children.push(g6);
          }
        } else {
          graph.children.push(g6);
        }
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
      ...visitor.getNodeModel(tree),
      ports: [],
      children: [],
      edges: []  
    };
    if (tree.resourceType !== REPEAT) {
      return graph;
    }
    // start node
    graph.ports.push(visitor.getPortModel(tree.start));

    // loop node
    if(tree.loop) {
      graph.children.push(visitor.getNodeModel(tree.loop));
    }

    // finish node
    graph.ports.push(visitor.getPortModel(tree.finish));
    // edges
    if(tree.elts.length > 0) {
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),
      });

    }

    // start <- loop <- finish
    // reverse the arrow direction
    if(typeof(tree.loop) !== "undefined") {
      let edgeModel = visitor.getEdgeModel(tree);
      edgeModel.style.startArrow = false;
      edgeModel.style.endArrow = false;

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.start.id],
        targets: [tree.loop.id],
        ...edgeModel,
      });
      
      edgeModel = visitor.getEdgeModel(tree);
      edgeModel.style.startArrow = true;
      edgeModel.style.endArrow = false;

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.loop.id],
        targets: [tree.finish.id],
        ...edgeModel,
      });

    } else {
      
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.finish.id],
        targets: [tree.start.id],
        ...visitor.getEdgeModel(tree),
      });
    }
    //*/
    // edges
    if(tree.elts.length > 0) {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.elts[tree.elts.length-1].finish.id],
        targets: [tree.finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }
    
    // concatenate G6 graphs
    // nodes
    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        if (filterFn) {
          if (!filterFn(g6)) {
            graph.children.push(g6);
          }
        } else {
          graph.children.push(g6);
        }
      }
    });
    return graph;
  }
}

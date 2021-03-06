import {
  idGenFn
} from './util.js';

import {
  jsonToDslObject
} from '@imaguiraga/topology-dsl-core';


function updateInputOutputBindings(elt, graph, visitor) {
  // Add Inbounds nodes and edges from children
  elt.inputElts = elt.inputElts || [];
  elt.inputElts.forEach(t => {
    let ctree = t.accept(visitor);
    if (ctree !== null) {
      ctree.inbound = true;
      graph.children.push(ctree);
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [t.finish.id],
        targets: [elt.start.id],
        ...visitor.getEdgeModel(elt),
      });
    }
  });

  // Add Outbounds nodes and edges from children 
  elt.outputElts = elt.outputElts || [];
  elt.outputElts.forEach(t => {
    let ctree = t.accept(visitor);
    if (ctree !== null) {
      ctree.outbound = true;
      graph.children.push(ctree);
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [elt.finish.id],
        targets: [t.start.id],
        ...visitor.getEdgeModel(elt),
      });
    }
  });
}
export class DslToELKGenerator {
  constructor() {
    this.edgeCntIt = idGenFn('edge.', 0);
  }

  toElkGraph(tree, filterFn) {
    return {
      id: '$root',
      children: [
        this.visit(tree, filterFn)
      ]
    };
  }

  /**
   * Convert a dsl tree to ELK Graph.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ELK graph.
   */
  visit(_tree, filterFn) {
    if (typeof _tree === 'undefined' || _tree === null) {
      return null;
    }
    let tree = _tree;
    // Add start finish properties if missing
    tree = jsonToDslObject(tree);

    let result = null;
    if (typeof tree === 'undefined') {
      return result;
    }
    if (tree.compound) {
      switch (tree.kind) {
        case 'fanOut_fanIn':
        case 'fanIn':
        case 'fanOut':
        case 'group':
          result = MutltiPathEltDslToELKGenerator.visit(this, tree, filterFn, tree.kind);
          break;
        case 'optional':
          result = this._visitOptional(tree, filterFn);
          break;
        case 'sequence':
          result = this._visitSequence(tree, filterFn);
          break;
        case 'repeat':
          result = this._visitRepeat(tree, filterFn);
          break;
        case 'resoource':
          result = this._visitTerminal(tree, filterFn);
          break;
        default:
          console.error('==>WARNING: ' + tree.kind + ' type was not found');
          break;
      }

    } else {
      result = this._visitTerminal(tree, filterFn);
    }

    return result;
  }

  _visitSequence(tree, filterFn) {
    return SequenceEltDslToELKGenerator.visit(this, tree, filterFn);
  }

  _visitOptional(tree, filterFn) {
    return OptionalEltDslToELKGenerator.visit(this, tree, filterFn);
  }

  _visitRepeat(tree, filterFn) {
    return RepeatEltDslToELKGenerator.visit(this, tree, filterFn);
  }

  _visitTerminal(tree, filterFn) {
    return TerminalFlowEltDslToELKGenerator.visit(this, tree, filterFn);
  }

  getNodeModel(n) {
    let r = {
      id: n.id,
      label: n.title,
      model: {
        kind: n.kind,
        title: n.title,
        direction: n.direction,
        tagName: n.tagName,
        id: n.id,
        provider: n.provider,
        compound: n.compound,
        data: n.data
      },
      // use label for container elt
      labels: n.isTerminal() ? [] : [
        {
          text: n.title || n.id,
          properties: {
            'nodeLabels.placement': '[V_TOP, H_LEFT, OUTSIDE]',
          }
        }
      ]
    };
    // Layout direction
    if (n.direction !== null) {
      r.layoutOptions = {
        'org.eclipse.elk.direction': n.direction
      };
    }
    return r;
  }

  getPortModel(n) {
    let r = {
      id: n.id,
      label: n.id,
      model: {
        kind: 'port',
        tagName: 'port',
        compound: false,
        provider: 'custom',
        id: n.id,
        data: n.data
      },
      // use label for container elt
      labels: n.isTerminal() ? [] : [
        {
          text: n.title || n.id
        }
      ]
    };
    return r;
  }

  getSynthPortModel(n, tagName = 'port') {
    let r = this.getPortModel(n);
    r.model.tagName = tagName;
    r.id = r.id + '.port';
    r.model.id = r.id;
    r.model.compound = false;
    return r;
  }

  getEdgeModel(n) {
    let r = {
      model: {
        provider: n.provider,
        tagName: 'edge',
        kind: 'edge'
      },
      style: {
        startArrow: false,
        endArrow: true,
      }
    };
    return r;
  }

}

/**
 * Class TerminalFlowEltDslToELKGenerator.
 */
class TerminalFlowEltDslToELKGenerator {
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  static visit(visitor, tree, filterFn) {
    const parent = visitor.getNodeModel(tree);
    const graph = {
      ...parent,
      ports: [],
      children: [],
      edges: []
    };
    // start + finish nodes
    graph.ports.push(visitor.getPortModel(tree.start));
    graph.ports.push(visitor.getPortModel(tree.finish));

    // Check if the only element is not a string 
    if (typeof tree.elts[0] === 'object') {
      let n = visitor.getNodeModel(tree);
      n.parent = parent;
      if (filterFn) {
        if (!filterFn(n)) {
          graph.children.push(n);
        }
      } else {
        graph.children.push(n);
      }
    }
    return graph;
  }

}

/**
 * Class SequenceEltDslToELKGenerator.
 */
class SequenceEltDslToELKGenerator {
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  static visit(visitor, tree, filterFn) {
    const SEQUENCE = 'sequence';
    const parent = visitor.getNodeModel(tree);
    const graph = {
      ...parent,
      /* layoutOptions: 
       { 
         'nodePlacement.strategy': 'NETWORK_SIMPLEX'
       },//*/
      ports: [],
      children: [],
      edges: []
    };
    if (tree.kind !== SEQUENCE) {
      return graph;
    }
    // start + finish nodes
    graph.ports.push(visitor.getPortModel(tree.start));
    graph.ports.push(visitor.getPortModel(tree.finish));

    const start = visitor.getSynthPortModel(tree.start, 'start');
    graph.children.push(start);
    const finish = visitor.getSynthPortModel(tree.finish, 'finish');
    graph.children.push(finish);

    // edges

    graph.edges.push({
      id: `${visitor.edgeCntIt.next().value}`,
      sources: [start.id],
      targets: [tree.elts[0].start.id],
      ...visitor.getEdgeModel(tree),
    });
    //*/
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
      targets: [finish.id],
      ...visitor.getEdgeModel(tree),
    });
    //*/
    // concatenate graphs

    // nodes
    tree.elts.forEach(elt => {
      let ctree = elt.accept(visitor, n => tree.foundElt(n));
      if (ctree !== null) {
        ctree.parent = parent;
        if (filterFn) {
          if (!filterFn(ctree)) {
            graph.children.push(ctree);
            updateInputOutputBindings(elt, graph, visitor);
          }
        } else {
          graph.children.push(ctree);
          updateInputOutputBindings(elt, graph, visitor);
        }
      }

    });

    return graph;
  }

}

/**
 * Class MutltiPathEltDslToELKGenerator.
 */
class MutltiPathEltDslToELKGenerator {
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  static visit(visitor, tree, filterFn, type) {
    //const type = 'choice' | 'parallel';
    const parent = visitor.getNodeModel(tree);
    const graph = {
      ...parent,
      ports: [],
      children: [],
      edges: []
    };
    //
    if (tree.kind !== type) {
      return graph;
    }
    // start + finish nodes
    graph.ports.push(visitor.getPortModel(tree.start));
    graph.ports.push(visitor.getPortModel(tree.finish));
    // edges
    // groups are just containers
    if (type === 'fanOut') {
      const start = visitor.getSynthPortModel(tree.start, 'start');
      graph.children.push(start);

      (tree.elts || []).forEach((elt) => {
        graph.edges.push({
          id: `${visitor.edgeCntIt.next().value}`,
          sources: [start.id],
          targets: [elt.start.id],
          ...visitor.getEdgeModel(tree),
        });
      });

    } else if (type === 'fanIn') {
      const finish = visitor.getSynthPortModel(tree.finish, 'finish');
      graph.children.push(finish);
      (tree.elts || []).forEach((elt) => {
        graph.edges.push({
          id: `${visitor.edgeCntIt.next().value}`,
          sources: [elt.finish.id],
          targets: [finish.id],
          ...visitor.getEdgeModel(tree),
        });
      });

    } else if (type === 'fanOut_fanIn') {
      const start = visitor.getSynthPortModel(tree.start, 'start');
      graph.children.push(start);
      const finish = visitor.getSynthPortModel(tree.finish, 'finish');
      graph.children.push(finish);
      (tree.elts || []).forEach((elt) => {
        graph.edges.push({
          id: `${visitor.edgeCntIt.next().value}`,
          sources: [start.id],
          targets: [elt.start.id],
          ...visitor.getEdgeModel(tree),
        });

        graph.edges.push({
          id: `${visitor.edgeCntIt.next().value}`,
          sources: [elt.finish.id],
          targets: [finish.id],
          ...visitor.getEdgeModel(tree),
        });
      });
    }
    // concatenate graphs
    // nodes
    tree.elts.forEach(elt => {
      let ctree = elt.accept(visitor, n => tree.foundElt(n));
      if (ctree !== null) {
        ctree.parent = parent;
        if (filterFn) {
          if (!filterFn(ctree)) {
            graph.children.push(ctree);
            updateInputOutputBindings(elt, graph, visitor);
          }
        } else {
          graph.children.push(ctree);
          updateInputOutputBindings(elt, graph, visitor);
        }
      }
    });

    return graph;
  }

}

/**
 * Class OptionalEltDslToELKGenerator.
 */
class OptionalEltDslToELKGenerator {
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  static visit(visitor, tree, filterFn) {
    const OPTIONAL = 'optional';
    const parent = visitor.getNodeModel(tree);
    const graph = {
      ...parent,
      ports: [],
      children: [],
      edges: []
    };
    if (tree.kind !== OPTIONAL) {
      return graph;
    }
    // start node
    graph.ports.push(visitor.getPortModel(tree.start));

    // skip node
    if (tree.skip) {
      graph.children.push(visitor.getNodeModel(tree.skip));
    }

    graph.ports.push(visitor.getPortModel(tree.finish));
    // edges

    const start = visitor.getSynthPortModel(tree.start, 'start');
    graph.children.push(start);
    const finish = visitor.getSynthPortModel(tree.finish, 'finish');
    graph.children.push(finish);

    if (tree.elts.length > 0) {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),

      });

    }

    // start -> skip? -> finish
    if (typeof (tree.skip) !== 'undefined') {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [start.id],
        targets: [tree.skip.id],
        ...visitor.getEdgeModel(tree),
      });

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.skip.id],
        targets: [finish.id],
        ...visitor.getEdgeModel(tree),
      });
    } else {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [start.id],
        targets: [finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }

    if (tree.elts.length > 0) {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.elts[tree.elts.length - 1].finish.id],
        targets: [finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }
    // concatenate graphs
    // nodes
    tree.elts.forEach(elt => {
      let ctree = elt.accept(visitor, n => tree.foundElt(n));
      if (ctree !== null) {
        ctree.parent = parent;
        if (filterFn) {
          if (!filterFn(ctree)) {
            graph.children.push(ctree);
            updateInputOutputBindings(elt, graph, visitor);
          }
        } else {
          graph.children.push(ctree);
          updateInputOutputBindings(elt, graph, visitor);
        }
      }
    });

    return graph;
  }
}

/**
 * Class RepeatEltDslToELKGenerator.
 */
class RepeatEltDslToELKGenerator {
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  static visit(visitor, tree, filterFn) {
    const REPEAT = 'repeat';
    const parent = visitor.getNodeModel(tree);
    const graph = {
      ...parent,
      ports: [],
      children: [],
      edges: []
    };
    if (tree.kind !== REPEAT) {
      return graph;
    }
    // start node
    graph.ports.push(visitor.getPortModel(tree.start));

    // loop node
    if (tree.loop) {
      graph.children.push(visitor.getNodeModel(tree.loop));
    }

    // finish node
    graph.ports.push(visitor.getPortModel(tree.finish));

    const start = visitor.getSynthPortModel(tree.start, 'start');
    graph.children.push(start);
    const finish = visitor.getSynthPortModel(tree.finish, 'finish');
    graph.children.push(finish);
    // edges
    if (tree.elts.length > 0) {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [start.id],
        targets: [tree.elts[0].start.id],
        ...visitor.getEdgeModel(tree),
      });

    }

    // start <- loop <- finish
    // reverse the arrow direction
    if (typeof (tree.loop) !== 'undefined') {
      let edgeModel = visitor.getEdgeModel(tree);
      edgeModel.style.startArrow = false;
      edgeModel.style.endArrow = false;

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [start.id],
        targets: [tree.loop.id],
        ...edgeModel,
      });

      edgeModel = visitor.getEdgeModel(tree);
      edgeModel.style.startArrow = true;
      edgeModel.style.endArrow = false;

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.loop.id],
        targets: [finish.id],
        ...edgeModel,
      });

    } else {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [finish.id],
        targets: [start.id],
        ...visitor.getEdgeModel(tree),
      });
    }
    //*/
    // edges
    if (tree.elts.length > 0) {

      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: [tree.elts[tree.elts.length - 1].finish.id],
        targets: [finish.id],
        ...visitor.getEdgeModel(tree),
      });
    }

    // concatenate graphs
    // nodes
    tree.elts.forEach(elt => {
      let ctree = elt.accept(visitor, n => tree.foundElt(n));
      if (ctree !== null) {
        ctree.parent = parent;
        if (filterFn) {
          if (!filterFn(ctree)) {
            graph.children.push(ctree);
            updateInputOutputBindings(elt, graph, visitor);
          }
        } else {
          graph.children.push(ctree);
          updateInputOutputBindings(elt, graph, visitor);
        }
      }
    });
    return graph;
  }
}

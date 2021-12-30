import {
  idGenFn
} from '../util.js';

import {
  jsonToDslObject, group
} from '@imaguiraga/topology-dsl-core';

const SEQUENCE = 'sequence';
const OPTIONAL = 'optional';
const REPEAT = 'repeat';
const START = 'start';
const FINISH = 'finish';
const PORT = 'port';
const EDGE = 'edge';

const FANOUT_FANIN = 'fanOut_fanIn';
const FANIN = 'fanIn';
const FANOUT = 'fanOut';
const GROUP = 'group';
const RESOURCE = 'resource';
export class DslToELKGenerator {
  constructor() {
    this.edgeCntIt = idGenFn(`${EDGE}.`, 0);
  }

  toElkGraph(tree, filterFn) {
    return {
      id: '$root',
      layoutOptions: {
        'algorithm': 'layered',
        'elk.hierarchyHandling': 'SEPARATE_CHILDREN',
      },
      children: [
        this.visit(group(tree), filterFn)
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
    if (_tree === undefined || _tree === null) {
      return null;
    }
    let tree = _tree;
    // Add start finish properties if missing
    tree = jsonToDslObject(tree);

    let result = null;
    if (tree === undefined || tree === null) {
      return result;
    }
    if (tree.compound) {
      switch (tree.kind) {
        case GROUP:
          result = GroupEltDslToELKGenerator.instance.visitGroup(this, tree, filterFn, tree.kind);
          break;
        case OPTIONAL:
          result = OptionalEltDslToELKGenerator.instance.visitOptional(this, tree, filterFn);
          break;
        case SEQUENCE:
          result = SequenceEltDslToELKGenerator.instance.visitSequence(this, tree, filterFn);
          break;
        case REPEAT:
          result = RepeatEltDslToELKGenerator.instance.visitRepeat(this, tree, filterFn);
          break;
        case RESOURCE:
          result = TerminalFlowEltDslToELKGenerator.instance.visitTerminal(this, tree, filterFn);
          break;
        default:
          console.error('==> WARNING: ' + tree.kind + ' type was not found');
          break;
      }

    } else {
      result = TerminalFlowEltDslToELKGenerator.instance.visitTerminal(this, tree, filterFn);
    }

    return result;
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
            // 'nodeLabels.placement': '[V_TOP, H_LEFT, OUTSIDE]',
            'nodeLabels.placement': '[V_TOP, H_LEFT, INSIDE]',
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
        kind: PORT,
        tagName: PORT,
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

  getSynthPortModel(n, tagName = PORT) {
    let r = this.getPortModel(n);
    r.model.tagName = tagName;
    r.id = r.id + `.${PORT}`;
    r.model.id = r.id;
    r.model.compound = false;
    return r;
  }

  getEdgeModel(n) {
    let r = {
      model: {
        provider: n.provider,
        tagName: EDGE,
        kind: EDGE
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
  static instance = new TerminalFlowEltDslToELKGenerator();

  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  visitTerminal(visitor, tree, filterFn) {
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
 * Class GroupEltDslToELKGenerator.
 */
class GroupEltDslToELKGenerator {
  static instance = new GroupEltDslToELKGenerator();
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  visitGroup(visitor, tree, filterFn, type) {
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

    this.buildEdges(tree, graph, visitor, type);

    // concatenate graphs
    // nodes
    const self = this;
    this.buildNodes(tree.elts, tree, graph, visitor, parent, filterFn);

    return graph;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  buildEdges(tree, graph, visitor, type) {
    //NOOP
  }

  buildNodes(elts, tree, graph, visitor, parent, filterFn) {
    if (elts === undefined || elts === null || (Array.isArray(elts) && elts.length === 0)) {
      return;
    }
    const self = this;
    let _elts = Array.isArray(elts) ? elts : [elts];
    _elts.forEach(elt => {
      let arr = [];
      if (Array.isArray(elt)) {
        arr = elt;
      } else {
        arr.push(elt);
      }

      // From
      if (elt.eltsFrom !== undefined && elt.eltsFrom.length > 0) {
        this.buildNodes(elt.eltsFrom, tree, graph, visitor, parent, filterFn);
        let sources = this.getFinish(elt.eltsFrom);
        let targets = this.getStart(elt);

        this.buildLinks(sources, targets, graph, tree, visitor);
      }

      arr.forEach((a) => {
        if (Array.isArray(a)) {
          this.buildNodes(a, tree, graph, visitor, parent, filterFn);
        } else if (typeof a === 'object') {
          let ctree = a.accept === undefined ? a : a.accept(visitor, n => tree.foundElt(n));
          if (ctree !== null) {
            ctree.parent = parent;
            if (filterFn) {
              if (!filterFn(ctree)) {
                graph.children.push(ctree);
              }
            } else {
              graph.children.push(ctree);
            }
          }
        }

      }, self);

      // To
      if (elt.eltsTo !== undefined && elt.eltsTo.length > 0) {
        this.buildNodes(elt.eltsTo, tree, graph, visitor, parent, filterFn);
        let sources = this.getFinish(elt);
        let targets = this.getStart(elt.eltsTo);

        this.buildLinks(sources, targets, graph, tree, visitor);
      }
    }, self);
  }

  getStart(elts) {
    let result = [];
    if (Array.isArray(elts)) {
      result = elts.map((elt) => {
        if (Array.isArray(elt)) {
          return this.getStart(elt);
        } else {
          return elt.start.id;
        }
      }, this);
    } else {
      result = [elts.start.id];
    }
    return result;
  }

  getFinish(elts) {
    let result = [];
    if (Array.isArray(elts)) {
      result = elts.map((elt) => {
        if (Array.isArray(elt)) {
          return this.getFinish(elt);
        } else {
          return elt.finish.id;
        }
      }, this);

    } else {
      result = [elts.finish.id];
    }
    return result;
  }

  toArray(elts) {
    let result = [];
    if (Array.isArray(elts)) {
      elts.forEach((elt) => {
        result.push(...this.toArray(elt));
      }, this);

    } else {
      result.push(elts);
    }
    return result;

  }

  buildLinks(_sources_, _targets_, graph, tree, visitor) {
    // Expand in case the element is an array
    let sources = this.toArray(_sources_);
    let targets = this.toArray(_targets_);

    if (sources.length === 1 && targets.length === 1) {
      // 1 -> 1
      graph.edges.push({
        id: `${visitor.edgeCntIt.next().value}`,
        sources: sources,
        targets: targets,
        ...visitor.getEdgeModel(tree),
      });

    } else if (sources.length === 1 && targets.length > 1) {
      // 1 -> n
      targets.forEach((t) => {
        graph.edges.push({
          id: `${visitor.edgeCntIt.next().value}`,
          sources: sources,
          targets: [t],
          ...visitor.getEdgeModel(tree),
        });
      }, this);

    } else if (sources.length > 1 && targets.length === 1) {
      // n -> 1
      sources.forEach((s) => {
        graph.edges.push({
          id: `${visitor.edgeCntIt.next().value}`,
          sources: [s],
          targets: targets,
          ...visitor.getEdgeModel(tree),
        });
      }, this);

    } else if (sources.length > 1 && targets.length > 1) {
      // n -> n => n -> 1 -> n
      // add synthetic link clone
      const link = visitor.getSynthPortModel(tree.start, START);
      link.id = `${visitor.edgeCntIt.next().value}.link`;
      // link.model.tagName = 'mark';
      graph.children.push(link);
      let links = [link.id];

      // n -> 1
      this.buildLinks(sources, links, graph, tree, visitor);
      // 1 -> n
      this.buildLinks(links, targets, graph, tree, visitor);

    }
  }
}

/**
 * Class SequenceEltDslToELKGenerator.
 */
class SequenceEltDslToELKGenerator extends GroupEltDslToELKGenerator {
  static instance = new SequenceEltDslToELKGenerator();
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  visitSequence(visitor, tree, filterFn) {
    return this.visitGroup(visitor, tree, filterFn, SEQUENCE);
  }

  buildEdges(tree, graph, visitor, type) {
    if (type !== SEQUENCE) {
      return;
    }

    const start = visitor.getSynthPortModel(tree.start, START);
    graph.children.push(start);
    const finish = visitor.getSynthPortModel(tree.finish, FINISH);
    graph.children.push(finish);

    // edges

    // start -> elts
    let sources = [start.id];
    let targets = this.getStart(tree.elts[0]);

    this.buildLinks(sources, targets, graph, tree, visitor);

    // elts -> elts
    for (let i = 0; i < tree.elts.length - 1; i++) {
      sources = this.getFinish(tree.elts[i]);
      targets = this.getStart(tree.elts[i + 1]);

      this.buildLinks(sources, targets, graph, tree, visitor);

    }

    // elts -> finish
    sources = this.getFinish(tree.elts[tree.elts.length - 1]);
    targets = [finish.id];

    this.buildLinks(sources, targets, graph, tree, visitor);

  }

}

/**
 * Class OptionalEltDslToELKGenerator.
 */
class OptionalEltDslToELKGenerator extends GroupEltDslToELKGenerator {
  static instance = new OptionalEltDslToELKGenerator();
  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  visitOptional(visitor, tree, filterFn) {
    return this.visitGroup(visitor, tree, filterFn, OPTIONAL);
  }

  buildEdges(tree, graph, visitor, type) {
    if (type !== OPTIONAL) {
      return;
    }

    const start = visitor.getSynthPortModel(tree.start, START);
    graph.children.push(start);
    const finish = visitor.getSynthPortModel(tree.finish, FINISH);
    graph.children.push(finish);

    if (tree.elts.length > 0) {
      // start -> elts
      let sources = [start.id];
      let targets = this.getStart(tree.elts[0]);

      this.buildLinks(sources, targets, graph, tree, visitor);

      // start -> finish
      sources = [start.id];
      targets = [finish.id];

      this.buildLinks(sources, targets, graph, tree, visitor);

      // elts -> finish
      sources = this.getFinish(tree.elts);
      targets = [finish.id];

      this.buildLinks(sources, targets, graph, tree, visitor);

    }

  }
}

/**
 * Class RepeatEltDslToELKGenerator.
 */
class RepeatEltDslToELKGenerator extends GroupEltDslToELKGenerator {
  static instance = new RepeatEltDslToELKGenerator();

  /**
   * Convert a dsl tree to ctree Graph graph.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} ctree Graph graph.
   */
  visitRepeat(visitor, tree, filterFn) {
    return this.visitGroup(visitor, tree, filterFn, REPEAT);
  }

  buildEdges(tree, graph, visitor, type) {
    if (type !== REPEAT) {
      return;
    }

    const start = visitor.getSynthPortModel(tree.start, START);
    graph.children.push(start);
    const finish = visitor.getSynthPortModel(tree.finish, FINISH);
    graph.children.push(finish);

    // edges
    if (tree.elts.length > 0) {

      // start -> elts
      let sources = [start.id];
      let targets = this.getStart(tree.elts);

      this.buildLinks(sources, targets, graph, tree, visitor);

      // elts -> finish
      sources = this.getFinish(tree.elts);
      targets = [finish.id];

      this.buildLinks(sources, targets, graph, tree, visitor);

      // elts -> elts
      sources = this.getFinish(tree.elts);
      targets = [tree.elts[0].id];
      // targets = this.getStart(tree.elts);

      this.buildLinks(sources, targets, graph, tree, visitor);

    }

  }
}

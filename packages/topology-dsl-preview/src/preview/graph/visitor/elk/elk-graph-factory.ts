import {
  DslToELKGenerator
} from './elk-graph-generator.js';

const elkGenerator = new DslToELKGenerator();

export function toElkGraph(dslObject: any) {
  let elkgraph = null;
  try {
    // dslObject to elkgraph
    elkgraph = elkGenerator.toElkGraph(dslObject);
  } catch (e) {
    console.error(e);
  }
  return elkgraph;
}

export function elkGraphToJson(elkGraph: any): any {
  let graph = { nodes: [], edges: [] };
  let visited: Set<string> = new Set();
  try {
    // dslObject to elkgraph
    buildGraph(visited, elkGraph, graph);
  } catch (e) {
    console.error(e);
  }
  return graph;
}

const exclude: string[] = ['ports', 'children'];
function buildGraph(visited: Set<string>, elkNode: any, graph: any) {
  // deep Copy Clone node without 
  // Skip visited nodes
  if (visited.has(elkNode.id)) {
    return;
  } else {
    visited.add(elkNode.id)
  }
  
  graph.nodes.push(buildNodeObject(elkNode, exclude));

  elkNode.ports.forEach((p: any) => {
    if (visited.has(p.id)) {
      return;
    } else {
      visited.add(p.id)
      graph.nodes.push(buildNodeObject(p, exclude))
    }
  });

  elkNode.edges.forEach((e: any) => {
    graph.edges.push(buildEdgeObject(e, []))
  });

  // Recursively build graph
  elkNode.children.forEach((c: any) => {
    buildGraph(visited, c, graph);
  });
}

function buildNodeObject(elt: any, exclude: string[]): any {

  let tmp: any = Object.keys(elt).filter(k => !exclude.includes(k)).reduce((res, k) => Object.assign(res, { [k]: elt[k] }));

  // Convert nodes to their ids
  exclude.forEach((k) => {
    if (elt[k] !== undefined && Array.isArray(elt[k])) {
      tmp[k] = elt[k].filter((v: any) => v.id !== undefined).map((v: any) => { v.id });
    }
  });

  let obj = {
    key: tmp.id,
    attributes: tmp
  } as any;

  return obj;
}

function buildEdgeObject(elt: any, exclude: string[]): any {

  let tmp: any = Object.keys(elt).filter(k => !exclude.includes(k)).reduce((res, k) => Object.assign(res, { [k]: elt[k] }));

  // Convert nodes to their ids
  exclude.forEach((k) => {
    if (elt[k] !== undefined && Array.isArray(elt[k])) {
      tmp[k] = elt[k].filter((v: any) => v.id !== undefined).map((v: any) => { v.id });
    }
  });

  let obj = {
    key: tmp.id,
    source: elt.sources[0],
    target: elt.targets[0],
    attributes: tmp
  } as any;

  return obj;
}
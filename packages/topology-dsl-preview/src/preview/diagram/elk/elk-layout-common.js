//const ELK = require('elkjs');
import ELK from 'elkjs/lib/elk.bundled.js';

import {
  FlowToELKVisitor,
  ELKDimensionVisitor
} from '../visitor/index.js';

const elkvisitor = new FlowToELKVisitor();

export function toElkGraph(dslObject) {
  let elkgraph = null;
  try {
    // dslObject to elkgraph
    elkgraph = elkvisitor.toElkGraph(dslObject);
  } catch (e) {
    console.error(e);
  }
  return elkgraph;
}

export function elkLayout() {
  const elkDimensionVisitor = new ELKDimensionVisitor();
  const elk = new ELK();
  let options = {
    'algorithm': 'layered',
    'nodePlacement.strategy': 'NETWORK_SIMPLEX', //'BRANDES_KOEPF'
    'port.borderOffset': 4,
    'padding': 20,
    'edgeRouting': 'ORTHOGONAL',
    'layered.mergeEdges': true,
    'zoomToFit': true,
    'spacing': 40,
    'spacing.nodeNodeBetweenLayers': 40,
    'spacing.edgeNodeBetweenLayers': 40,
    'spacing.edgeEdgeBetweenLayers': 40,
    'layering.strategy': 'LONGEST_PATH',
    'spacing.labelNode': 8
  };
  //https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-layering-strategy.html
  //https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-nodeplacement-strategy.html
  function layoutFn(inelkgraph) {
    if (inelkgraph === null ) {
      return Promise.resolve(null);
    }
    // Add node width.height
    let elkgraph = elkDimensionVisitor.visit(inelkgraph);
    if (elkgraph === null ) {
      return Promise.resolve(null);
    }
    //console.log(JSON.stringify(elkgraph,null,'  '));

    elk.knownLayoutOptions().then((d) => {
      //console.log(d);
    });
    // start the layout
    let elkpromise = elk.layout(elkgraph, {
      layoutOptions: options,
      logging: true,
      measureExecutionTime: true
    }).then((elkLayoutGraph) => {
      const g = toAbsolute(elkLayoutGraph);
      console.log(g);
      return g;
    });

    return elkpromise;
  }

  layoutFn.nodeHeight = function (newSize) {
    if (!arguments.length) return elkDimensionVisitor._nodeHeight;
    elkDimensionVisitor.nodeHeight(newSize);
    return this;
  };

  layoutFn.nodeWidth = function (newSize) {
    if (!arguments.length) return elkDimensionVisitor._nodeWidth;
    elkDimensionVisitor.nodeWidth(newSize);
    return this;
  };

  layoutFn.nodeSize = function (width, height) {
    if (!arguments.length) return [elkDimensionVisitor._nodeWidth, elkDimensionVisitor._nodeHeight];

    elkDimensionVisitor.nodeWidth(width);
    elkDimensionVisitor.nodeHeight(height || width);

    return this;
  };

  layoutFn.portSize = function (newSize) {
    if (!arguments.length) return elkDimensionVisitor._portSize;
    elkDimensionVisitor.portSize(newSize);
    return this;
  };

  layoutFn.options = function (newOptions) {
    if (!arguments.length) {
      return options;
    }
    options = newOptions;
    return this;
  };

  return layoutFn;
}

export function toAbsolute(elkNode,x0=0,y0=0) {

   // Clone node 
  const n = elkNode ;
  // absolute coordinate
  n.ax = n.x + x0;
  n.ay = n.y + y0;

  elkNode.edges = elkNode.edges || []; 
  elkNode.edges.forEach((e) => {
    const t = e;
    // absolute coordinate
    t.source = e.sources[0];
    t.target = e.targets[0];
    // junctionPoints
    t.junctionPoints = t.junctionPoints || [];
    t.junctionPoints.forEach((j) => {
      j.ax = j.x + n.ax; 
      j.ay = j.y + n.ay; 
    });

    // Update sections
    t.sections = t.sections || [];
    t.sections.forEach((s) => {
      // startPoint
      s.startPoint.ax = s.startPoint.x + n.ax; 
      s.startPoint.ay = s.startPoint.y + n.ay; 
      // endPoint
      s.endPoint.ax = s.endPoint.x + n.ax; 
      s.endPoint.ay = s.endPoint.y + n.ay; 
      // bendPoints
      s.bendPoints = s.bendPoints || [];
      s.bendPoints.forEach((b) => {
        b.ax = b.x + n.ax; 
        b.ay = b.y + n.ay;
      });
    });

  });
  
  elkNode.ports = elkNode.ports || []; 
  elkNode.ports.forEach((p) => {
    // absolute coordinate
    p.ax = p.x; 
    p.ay = p.y;
  });  

  elkNode.children = elkNode.children || []; 
  elkNode.children.forEach((c) => {
    toAbsolute(c,n.ax,n.ay);
  }); 

  return n;
}
/*
{
  "id": "choice.28",
  "label": "choice.28",
  "model": {
    "provider": "default",
    "resourceType": "fanOut_fanIn",
    "subType": "choice",
    "tagName": "flow",
    "compound": true
  },
  "labels": [
    {
      "text": "choice.28",
      "height": 16
    }
  ],
  "ports": [
    {
      "id": "terminal.29",
      "label": "terminal.29",
      "model": {
        "provider": "default",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "compound": false
      },
// */
export function toX6Graph(elkNode) {
  const g = {
    nodes:[], edges:[]
  };
   // Clone node 
  const n = { 
    id: elkNode.id,
    label: elkNode.label,
    // data: elkNode.model,
    x: elkNode.ax,
    y: elkNode.ay,
    width: elkNode.width,
    height: elkNode.height,
  };
  g.nodes.push(n);

  // Ports
  elkNode.ports = elkNode.ports || []; 
  const items = elkNode.ports.map((p) => {
    const r = {
      group: 'abs',
      id: p.id,
      args: {
        x: p.ax + 4,
        y: p.ay + 4
      },
     // data: p.model
    };
    return r;
  });

  n.ports = {
    items: items,
    groups: {
      abs: {
        position: {
          name: 'absolute'
        },
        zIndex: 10,
        attrs: {
          circle: {
            r: 4,//p.width,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff'
          },
          text: {
            fontSize: 12,
            fill: '#888'
          }
        }
      }
    }
  };

  n.children = [];
  elkNode.children = elkNode.children || []; 
  elkNode.children.forEach((c) => {
    n.children.push(c.id);
    const t = toX6Graph(c);
    g.nodes = g.nodes.concat(t.nodes);
    g.edges = g.edges.concat(t.edges);
  }); 

  // Edges
  elkNode.edges = elkNode.edges || []; 
  elkNode.edges.forEach((e) => {
    const t = {};
    t.id = e.id;
    // t.data = e.model;
    const source = e.sources[0];
    const target = e.targets[0];
    t.source = { cell: source.replace(/\.(start|finish)/ig,''), port: source };
    t.target = { cell: target.replace(/\.(start|finish)/ig,''), port: target };

    var d = e.sections[0];
    const vertices = [];
    if (d.startPoint && d.endPoint) {
      (d.bendPoints || []).forEach(function (bp, i) {
        vertices.push({ x: bp.ax, y: bp.ay });
      });
    }
    t.vertices = vertices;
    g.edges.push(t);
  });  
  return g;
}
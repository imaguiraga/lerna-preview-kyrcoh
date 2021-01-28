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
      //console.log(g);
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

export function toAbsolute(elkNode,) {
  return toAbsoluteIt(elkNode);
}

function toAbsoluteRec(elkNode,x0=0,y0=0) {
   // Clone node 
  const n = elkNode ;
  // absolute coordinate
  n.ax = n.x + x0;
  n.ay = n.y + y0;

  (elkNode.edges || []).forEach((e) => {
    const t = e;
    // absolute coordinate
    t.source = e.sources[0];
    t.target = e.targets[0];

    // Update sections
    (t.sections || []).forEach((s) => {
       // junctionPoints
      (s.junctionPoints || []).forEach((j) => {
        j.ax = j.x + n.ax; 
        j.ay = j.y + n.ay; 
      });

      // startPoint
      s.startPoint.ax = s.startPoint.x + n.ax; 
      s.startPoint.ay = s.startPoint.y + n.ay; 
      // endPoint
      s.endPoint.ax = s.endPoint.x + n.ax; 
      s.endPoint.ay = s.endPoint.y + n.ay; 
      // bendPoints
      (s.bendPoints || []).forEach((b) => {
        b.ax = b.x + n.ax; 
        b.ay = b.y + n.ay;
      });
    });

  });
  
  (elkNode.ports || []).forEach((p) => {
    // absolute coordinate
    p.ax = p.x + n.ax; 
    p.ay = p.y + n.ay;
  });  

  (elkNode.children || []).forEach((c) => {
    toAbsoluteRec(c,n.ax,n.ay);
  }); 

  return n;
  //*/
}

function toAbsoluteIt(elkNode) {
  // absolute coordinate
  elkNode.ax = elkNode.x;
  elkNode.ay = elkNode.y;
  const stack = [elkNode];

  while( stack.length >0) {
    let n = stack.pop();
    (n.edges || []).forEach((e) => {
      const t = e;
      // absolute coordinate
      t.source = e.sources[0];
      t.target = e.targets[0];

      // Update sections
      (t.sections || []).forEach((s) => {
        // junctionPoints
        (s.junctionPoints || []).forEach((j) => {
          j.ax = j.x + n.ax; 
          j.ay = j.y + n.ay; 
        });

        // startPoint
        s.startPoint.ax = s.startPoint.x + n.ax; 
        s.startPoint.ay = s.startPoint.y + n.ay; 
        // endPoint
        s.endPoint.ax = s.endPoint.x + n.ax; 
        s.endPoint.ay = s.endPoint.y + n.ay; 
        // bendPoints
        (s.bendPoints || []).forEach((b) => {
          b.ax = b.x + n.ax; 
          b.ay = b.y + n.ay;      
        });
      });

    });
    
    (n.ports || []).forEach((p) => {
      // absolute coordinate
      p.ax = p.x + n.ax; 
      p.ay = p.y + n.ay;
    });  

    (n.children || []).forEach((c) => {
      c.ax = c.x + n.ax; 
      c.ay = c.y + n.ay;
      stack.unshift(c);
    }); 
  }
  return elkNode;
}
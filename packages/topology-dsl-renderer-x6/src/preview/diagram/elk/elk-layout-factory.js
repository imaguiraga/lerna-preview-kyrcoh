//const ELK = require('elkjs');
import ELK from 'elkjs/lib/elk.bundled.js';

import {
  ELKDimensionVisitor
} from '../visitor/index.js';

const UNIT = 8;

export function elkLayout() {
  const elkDimensionVisitor = new ELKDimensionVisitor();
  const elk = new ELK();
  let options = {
    'algorithm': 'layered',
    //'hierarchyHandling': 'SEPARATE_CHILDREN',
    'nodePlacement.strategy': 'SIMPLE',//'NETWORK_SIMPLEX', //'BRANDES_KOEPF'
    'org.eclipse.elk.direction': 'RIGHT',
    'port.borderOffset': UNIT / 4,
    'padding': 2 * UNIT,
    'edgeRouting': 'ORTHOGONAL',
    'layered.mergeEdges': true,
    'zoomToFit': true,
    'spacing': 4 * UNIT,
    'spacing.nodeNodeBetweenLayers': 4 * UNIT,
    'spacing.edgeNodeBetweenLayers': 4 * UNIT,
    'spacing.edgeEdgeBetweenLayers': 4 * UNIT,
    //'layering.strategy': 'LONGEST_PATH', 'NETWORK_SIMPLEX'
    'layering.strategy': 'COFFMAN_GRAHAM ',
    'org.eclipse.elk.spacing.nodeSelfLoop': 3 * UNIT,
    'spacing.labelNode': UNIT
  };
  const DEBUG = false;
  //https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-layering-strategy.html
  //https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-nodeplacement-strategy.html
  function layoutFn(inelkgraph) {
    if (inelkgraph === null) {
      return Promise.resolve(null);
    }
    // Add node width.height
    let elkgraph = elkDimensionVisitor.visit(inelkgraph);
    if (elkgraph === null) {
      return Promise.resolve(null);
    }
    if (DEBUG) {
      console.log(JSON.stringify(elkgraph, null, '  '));
    }

    elk.knownLayoutOptions().then((d) => {
      //console.log(d);
    });
    // start the layout
    let elkpromise = elk.layout(elkgraph, {
      layoutOptions: options,
      logging: false,
      measureExecutionTime: false
    }).then((elkLayoutRelative) => {
      const elkLayoutAbsolute = toAbsoluteElkLayout(elkLayoutRelative);
      //console.log(elkLayoutAbsolute);
      return elkLayoutAbsolute;
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

export function toAbsoluteElkLayout(elkLayout) {
  return toAbsoluteElkLayoutIt(elkLayout);
}

function toAbsoluteElkLayoutRec(elkNode, x0 = 0, y0 = 0) {
  // Clone node 
  const n = elkNode;
  // absolute coordinate
  n.ax = n.x + x0;
  n.ay = n.y + y0;

  (n.labels || []).forEach((l) => {
    // absolute coordinate
    l.ax = l.x + x0;
    l.ay = l.y + y0;
  });

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
    toAbsoluteElkLayoutRec(c, n.ax, n.ay);
  });

  return n;
  //*/
}

export function buildNodeLookup(elkNode) {
  const index = new Map();

  const stack = [elkNode];
  // FIFO
  let i = 0;
  while (i < stack.length) {
    //let n = stack.pop();
    let n = stack[i];
    i++;
    index.set(n.id, n);

    (n.ports || []).forEach((p) => {
      stack.push(p);
    });

    (n.children || []).forEach((c) => {
      stack.push(c);
    });
  }
  return index;
}

function toAbsoluteElkLayoutIt(elkNode) {
  // absolute coordinate
  elkNode.ax = elkNode.x;
  elkNode.ay = elkNode.y;
  const stack = [elkNode];

  let i = 0;
  // FIFO
  while (i < stack.length) {
    let n = stack[i];
    i++;
    (n.labels || []).forEach((l) => {
      // absolute coordinate
      l.ax = l.x + n.ax;
      l.ay = l.y + n.ay;
    });

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
      stack.push(c);
    });
  }
  return elkNode;
}
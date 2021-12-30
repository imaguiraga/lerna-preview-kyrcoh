import './style/x6-elk-style.css';
import React from 'react';
import { Graph, Shape, Point, Node, Edge } from '@antv/x6';
import { elkLayout, buildNodeLookup } from './elk-layout-factory';
import { ResourceNode } from './node/reource-node';

Graph.registerNode(
  'resource-node',
  {
    inherit: 'react-shape',
    width: 180,
    height: 36,
    component: <ResourceNode />,
  },
  true,
)

function lineRouter(vertices/*: Point.PointLike[]*/, args/*: RandomRouterArgs*/, view/*: EdgeView*/) {
  const points = vertices.map((p) => Point.create(p));
  return points;
}
const LINE = 'line';
const DEBUG = false;

Graph.registerRouter(LINE, lineRouter);

const UNIT = 8;
const EMPTY_ARRAY = [];
export function createElkX6Renderer(_container_, _minimap_, _width_, _height_, _iconWidth_) {

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const width = (_width_ || containerElt.scrollWidth || 800);
  const height = (_height_ || containerElt.scrollHeight || 800);

  const x6Graph = createX6Graph(containerElt, _minimap_, width, height);
  const toElkLayout = elkLayout();
  toElkLayout.nodeSize(10 * UNIT).portSize(UNIT);

  function render(elkgraph) {
    if (elkgraph === null || elkgraph === undefined) {
      return Promise.resolve(null);
    }

    const lookup = buildNodeLookup(elkgraph);

    function refreshLayoutFn(_elkgraph_) {
      return toElkLayout(_elkgraph_).then((elkLayout) => {
        // Clear and redraw
        // reset diagram
        if (DEBUG) {
          console.log(JSON.stringify(elkLayout, null, ' '));
        }
        const x6Layout = toX6Layout(elkLayout);
        if (DEBUG) {
          console.log(x6Layout);
          console.log(JSON.stringify(x6Layout, null, ' '));
        }
        const start = new Date().getTime()
        x6Graph.fromJSON(x6Layout);
        x6Graph.unfreeze({
          progress({ done }) {
            if (done) {
              const time = new Date().getTime() - start;
              console.log(time)
              x6Graph.unfreeze({
                batchSize: 50,
              })
              x6Graph.zoomToFit({ padding: 8 })
            }
          },
        })
        return x6Graph;
      }).catch((e) => {
        console.log(e);
      });
    }

    const toggleCollapseNode = function (d) {
      if (d === undefined || d === null) {
        return;
      }
      // is expanded
      if (d.model.compound || d.collapsed === true) {
        if (d.collapsed !== true) {
          // Remove children and edges 
          d._children = d.children;
          d.children = EMPTY_ARRAY;

          d._edges = d.edges;
          d.edges = null;
          d.model.compound = false;
          d.collapsed = true;

        } else {
          // Restore children and edges
          d.children = d._children;
          d._children = null;

          d.edges = d._edges;
          d._edges = null;
          d.model.compound = true;
          d.collapsed = false;
        }

        refreshLayoutFn(elkgraph);
      }
    };

    x6Graph.on('node:dblclick', ({ e, x, y, node, view }) => {
      if (DEBUG) {
        console.log(node);
      }
      const elkLayoutNode = lookup.get(node.id);
      toggleCollapseNode(elkLayoutNode);
    });

    //*/
    return refreshLayoutFn(elkgraph);
  }

  return {
    render,
    graph: x6Graph
  };
}

export function toX6Layout(elkLayoutNode) {
  return toX6LayoutRec(elkLayoutNode);
}

function toX6LayoutRec(elkLayoutNode, x6Layout = { nodes: [], edges: [] }) {
  // Clone node 
  const n = createX6Node(elkLayoutNode, x6Layout);

  const children = [];
  (elkLayoutNode.children || []).forEach((c) => {
    children.push(c.id);
    toX6LayoutRec(c, x6Layout);
  });

  if (children.length > 0) {
    n.children = children;
  }

  // Edges
  (elkLayoutNode.edges || []).forEach((e) => {
    const t = createX6Edge(e, x6Layout);
  });
  return x6Layout;
}

function createX6Node(elkLayoutNode, x6Layout) {
  let model = elkLayoutNode.model || {};
  const n = {
    id: elkLayoutNode.id,
    //label: elkLayoutNode.label,
    data: {
      ...model,
      width: elkLayoutNode.width,
      height: elkLayoutNode.height
    },
    x: elkLayoutNode.ax,
    y: elkLayoutNode.ay,
    width: elkLayoutNode.width,
    height: elkLayoutNode.height,
    attrs: {
      body: {
        class: 'node',
      },
      fo: {
        class: 'node',
      }
    },
  };
  n.data.width = elkLayoutNode.width;
  n.data.height = elkLayoutNode.height;

  const clazz = ['node'];
  if (elkLayoutNode.model !== undefined) {
    clazz.push(elkLayoutNode.model.provider);
    clazz.push(elkLayoutNode.model.kind);
    clazz.push(elkLayoutNode.model.tagName);
  }
  n.attrs.body.class = clazz.join(' ');

  // Ports
  let PORT_RADIUS = 0;
  const ports = (elkLayoutNode.ports || []);
  const items = ports.map((p) => {
    PORT_RADIUS = p.width / 2;
    const r = {
      group: 'abs',
      id: p.id,
      args: {
        x: p.x + PORT_RADIUS,
        y: p.y + PORT_RADIUS
      },
      data: p.model
    };
    return r;
  });

  if (ports.length > 0) {
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
              class: 'port',
              r: PORT_RADIUS,
              magnet: false,
            },
            text: {
              fontSize: 0.8 * UNIT,
              fill: '#444'
            }
          }
        }
      }
    };
  }

  //node_modules\@antv\x6\lib\shape\standard\html.d.ts
  // Port rendering
  const children = (elkLayoutNode.children || []);
  const tagName = n.data.tagName;
  if (tagName === 'port' || tagName === 'start' || tagName === 'finish' || tagName === 'mark') {
    n.label = null;
    n.data.compound = undefined;
    n.shape = 'rect';
    n.attrs = {
      body: {
        class: n.data.tagName,
      },
      text: {
        fontSize: 0.8 * UNIT,
        fill: '#444'
      }
    };
    // Round corners
    if (tagName === 'mark') {
      n.label = null;// n.data.title;
      n.attrs.body.rx = 0;// UNIT / 2;
      n.attrs.body.ry = 0;// UNIT / 2;
    }

  } else {
    if (children.length === 0) {
      n.label = null;
      n.shape = 'resource-node';

    } else if (elkLayoutNode.labels !== undefined) {
      const l = createX6Label(elkLayoutNode, x6Layout);
    }
  }

  n.attrs.body.strokeWidth = (children.length > 0) ? '0px' : '1px';
  n.attrs.body.opacity = (children.length > 0) ? 0.15 : 0.9;
  x6Layout.nodes.push(n);
  return n;
}

function createX6Label(elkLayoutNode, x6Layout) {
  const label = elkLayoutNode.labels[0];
  // Label Node
  const model = elkLayoutNode.model || {};
  const l = {
    id: elkLayoutNode.id + '.label',
    //label: elkLayoutNode.label,
    data: {
      ...model,
      width: 30 * UNIT,//label.width,
      height: label.height,
    },
    x: label.ax,
    y: label.ay,
    width: elkLayoutNode.width,// - 1.5 * UNIT,
    height: label.height,
    attrs: {
      body: {
        class: 'label',
      },
      fo: {
        class: 'label',
      }
    },

  };
  l.data.compound = undefined;
  l.label = null;
  l.shape = 'resource-node';

  x6Layout.nodes.push(l);
  return l;
}

function createX6Edge(e, x6Layout) {
  const t = {
    attrs: {
      line: {
        class: 'edge',
        sourceMarker: {
          name: e.style.startArrow ? 'classic' : null,
          size: UNIT
        },
        targetMarker: {
          name: e.style.endArrow ? 'classic' : null,
          size: UNIT
        },
      }
    }
  };

  t.id = e.id;
  t.data = e.model;
  const source = e.sources[0];
  const target = e.targets[0];
  const regex1 = /\.(start|finish)/ig;
  const regex2 = /\.(start|finish)\.port/ig;

  if (source.match(regex2)) {
    t.source = { cell: source };
  } else {
    t.source = { cell: source.replace(regex1, ''), port: source };
  }

  if (target.match(regex2)) {
    t.target = { cell: target };
  } else {
    t.target = { cell: target.replace(regex1, ''), port: target };
  }

  if (e.sections !== undefined) {
    let d = e.sections[0];

    if (d.startPoint && d.endPoint) {
      /*     
      t.source = {
        x: d.startPoint.ax,
        y: d.startPoint.ay
      };

      t.target = {
        x: d.endPoint.ax,
        y: d.endPoint.ay
      };
      //*/
    }

    const vertices = [];
    (d.bendPoints || []).forEach(function (bp, i) {
      vertices.push({ x: bp.ax, y: bp.ay });
    });

    (d.junctionPoints || []).forEach(function (bp, i) {
      vertices.push({ x: bp.ax, y: bp.ay });
    });

    if (vertices.length > 0) {
      t.vertices = vertices;
    }
  }
  x6Layout.edges.push(t);

  return t;
}

function createX6Graph(containerElt, minimapContainer, width, height) {
  const x6Graph = new Graph({
    container: containerElt,
    grid: 1,
    //width: width,
    //height: height,
    //resizing: false,
    background: {
      color: '#fff',
    },
    interacting: false,
    async: true,
    frozen: true,
    sorting: 'approx',
    scroller: {
      enabled: true,
      pannable: true,
      pageVisible: true,
      pageBreak: true,
      //  className: 'app-content-pane'
    },
    panning: {
      enabled: true,
      modifiers: 'shift',
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
    connecting: {
      //snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      anchor: 'orth',
      connector: 'rounded',
      connectionPoint: 'boundary',
      router: {
        // https://x6.antv.vision/en/docs/tutorial/basic/edge/#router
        // node_modules\@antv\x6\lib\registry\router
        // https://x6.antv.vision/en/docs/api/registry/router#oneside
        // er orth metro manhattan https://x6.antv.vision/en/examples/edge/edge#edge
        name: LINE,
      }
    },
    minimap: {
      enabled: true,
      container: minimapContainer,
      minScale: 0.5,
      maxScale: 2,
      padding: UNIT / 2,
      width: 200,
      height: 160
    },
  });

  x6Graph.on('cell:mouseenter', ({ e, cell, view }) => {
    if (cell.isNode() && cell.getData().compound !== undefined) {
      cell.addTools([
        {
          name: 'boundary',
          args: {
            padding: 0,
            useCellGeometry: true,
            attrs: {
              fill: 'lightgrey',
              stroke: 'blue',
              strokeWidth: 3,
              strokeDasharray: 'none',
              fillOpacity: 0.45,
            },
          },
        },
      ]);
    }
  });

  x6Graph.on('cell:mouseleave', ({ e, cell, view }) => {
    cell.removeTools();
  });
  //*/
  return x6Graph;
}
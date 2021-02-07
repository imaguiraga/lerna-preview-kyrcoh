
import { Graph, Shape, Point } from '@antv/x6';
import { data } from './x6-data.js';
import { toElkGraph, elkLayout } from './elk-layout-factory';

function lineRouter(vertices/*: Point.PointLike[]*/, args/*: RandomRouterArgs*/, view/*: EdgeView*/) {
  const points = vertices.map((p) => Point.create(p));
  return points;
}
const LINE = 'line';
Graph.registerRouter(LINE, lineRouter);

const EMPTY_ARRAY = [];
export function createElkX6Renderer(_container_, _width_, _height_, _iconWidth_) {

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800) + 240;
  const height = (_height_ || containerElt.scrollHeight || 800) + 240;

  const graph = createX6Graph(containerElt, width, height);
  const layout = elkLayout();
  layout.nodeSize(80).portSize(8);

  function refreshFn(_elkgraph_) {
    return layout(_elkgraph_).then((elkLayoutGraph) => {
      // Clear and redraw
      // reset diagram
      //console.log(JSON.stringify(elkLayoutGraph,null, ' '));
      const result = toX6Graph(elkLayoutGraph);
      //console.log(result);
      //console.log(JSON.stringify(result,null, ' '));
      graph.fromJSON(result);
      //graph.resetCells([...result.nodes, ...result.edges]);
      return graph;
    }).catch((e) => {
      console.log(e);
    });
  }

  function render(dslObject) {
    if (dslObject !== null) {
      //console.log(JSON.stringify(dslObject,null,'  '));
    } else {
      return Promise.resolve(null);
    }

    let elkgraph = toElkGraph(dslObject);
    const toggleCollapseNode = function (d) {
      // is expanded
      if (d.model.compound) {
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

        refreshFn(elkgraph);
      }
    };

    graph.on('node:dblclick', ({ e, x, y, node, vew }) => {
      console.log(node);
      const elkNode = node.getData().elkNode;
      if (elkNode !== undefined) {
        toggleCollapseNode(elkNode);
      }
    });


    //*/
    return refreshFn(elkgraph);
  }

  return {
    render,
    zoomGraph(factor/*: number | 'fit' | 'real'*/) {
      if (typeof factor === 'number') {
        graph.zoom(factor);
      } else if (factor === 'fit') {
        graph.zoomToFit({ padding: 0 });
      } else if (factor) {
        graph.scale(1);
        graph.centerContent();
      }
    }
  };
}

export function toX6Graph(elkNode) {
  return toX6GraphRec(elkNode);
}

const RESOURCE_HTML = {
  render(node) { //: Cell
    const model = node.getData(); //as any
    const style = model.data.style;// IconPath

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';

    let iconPath = (style !== undefined && style !== null) ? encodeURI(style.iconURL) : null;
    // If icon exist
    if (iconPath !== undefined && iconPath !== null) {
      const img = document.createElement('img');
      const margin = 4;
      img.src = iconPath;
      //img.style.margin = margin;
      img.width = (model.compound === true ? model.height : model.height / 2) - 2 * margin;
      img.height = img.width;
      wrap.appendChild(img);
    }

    const textdiv = document.createElement('div');
    textdiv.style.padding = 4;
    textdiv.style.display = 'inline-block';

    textdiv.innerHTML =
      `<div><code>${style && style.product ? style.product : ''}</code></div>
      <div><code style='font-weight:bold;font-size:1.25em'>${model !== undefined ? model.title : ''}</code></div>`
      ;
    wrap.appendChild(textdiv);

    return wrap;
  },
  shouldComponentUpdate(node) { //: Cell
    return node.hasChanged('data');
  },
};

function toX6GraphRec(elkNode) {
  const g = {
    nodes: [], edges: []
  };

  // Clone node 
  let model = elkNode.model || {};
  const n = {
    id: elkNode.id,
    //label: elkNode.label,
    data: {
      ...model,
      width: elkNode.width,
      height: elkNode.height,
      elkNode: elkNode
    },
    x: elkNode.ax,
    y: elkNode.ay,
    width: elkNode.width,
    height: elkNode.height,
    attrs: {
      body: {
        class: 'node',
      },
      fo: {
        class: 'node',
      }
    },

  };
  n.data.width = elkNode.width;
  n.data.height = elkNode.height;

  const clazz = ['node'];
  if (elkNode.model !== undefined) {
    clazz.push(elkNode.model.provider);
    clazz.push(elkNode.model.resourceType);
    clazz.push(elkNode.model.subType);
  }
  n.attrs.body.class = clazz.join(' ');
  //*/
  g.nodes.push(n);

  // Ports
  const PORT_RADIUS = 4;
  const items = (elkNode.ports || []).map((p) => {
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
            fontSize: 12,
            fill: '#888'
          }
        }
      }
    }
  };

  const children = [];
  (elkNode.children || []).forEach((c) => {
    children.push(c.id);
    const t = toX6GraphRec(c);
    g.nodes = g.nodes.concat(t.nodes);
    g.edges = g.edges.concat(t.edges);
  });
  //node_modules\@antv\x6\lib\shape\standard\html.d.ts
  if (children.length === 0) {
    // Port rendering
    const tagName = n.data.tagName;
    if (tagName === 'port' || tagName === 'start' || tagName === 'finish' || tagName === 'mark') {
      n.label = null;
      n.shape = 'rect';
      n.attrs = {
        body: {
          class: n.data.tagName,
        },
        text: {
          fontSize: 12,
          fill: '#888'
        }
      };
      if (tagName === 'mark') {
        n.label = n.data.title;
        n.attrs.body.rx = 4;
        n.attrs.body.ry = 4;
      }

    } else {
      n.label = null;
      n.shape = 'html';
      n.html = RESOURCE_HTML;
    }

  } else if (elkNode.labels !== undefined) {
    const label = elkNode.labels[0];
    // Label Node
    model = elkNode.model || {};
    const l = {
      id: elkNode.id + '.label',
      //label: elkNode.label,
      data: {
        ...model,
        width: 3 * 80,//label.width,
        height: label.height,
      },
      x: label.ax,
      y: label.ay,
      width: elkNode.width,//3 * 80,//label.width,
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
    l.label = null;
    l.shape = 'html';
    l.html = RESOURCE_HTML;
    g.nodes.push(l);
  }

  n.attrs.body.strokeWidth = (children.length > 0) ? '0px' : '1px';
  n.attrs.body.opacity = (children.length > 0) ? 0.15 : 0.9;

  // Edges
  (elkNode.edges || []).forEach((e) => {
    const t = {
      attrs: {
        line: {
          class: 'edge',
          sourceMarker: {
            name: e.style.startArrow ? 'classic' : null,
            size: 8
          },
          targetMarker: {
            name: e.style.endArrow ? 'classic' : null,
            size: 8
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
    g.edges.push(t);
  });
  return g;
}


function createX6Graph(containerElt, width, height) {
  const graph = new Graph({
    container: containerElt,
    width: width,
    height: height,
    resizing: false,
    background: {
      color: '#fff',
    },
    grid: {
      size: 10,
      visible: false,
    },
    interacting: false,

    async: false,
    //frozen: true,
    scroller: {
      enabled: true,
      pannable: true,
      pageVisible: true,
      pageBreak: true,
      className: 'app-content-pane'
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

  });

  return graph;
}
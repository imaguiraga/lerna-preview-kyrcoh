
import { Graph, Shape, Point } from '@antv/x6';
import { data } from './x6-data.js';
import { toElkGraph, elkLayout } from './elk-layout';

function lineRouter(vertices/*: Point.PointLike[]*/, args/*: RandomRouterArgs*/, view/*: EdgeView*/) {
  const points = vertices.map((p) => Point.create(p));
  return points;
}
const LINE = 'line';
Graph.registerRouter(LINE, lineRouter);

export function createElkX6Renderer(_container_, _width_, _height_, _iconWidth_) {

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800) + 240;
  const height = (_height_ || containerElt.scrollHeight || 800) + 240;

  const graph = createX6Graph(containerElt,width,height);
  // graph.fromJSON(data);

/*
  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  wrap.style.height = '100%';
  wrap.style.background = '#f0f0f0';
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'center';
  wrap.style.alignItems = 'center';
  wrap.innerText = 'World';

  const target1 = graph.addNode({
    x: 180,
    y: 160,
    width: 100,
    height: 40,
    shape: 'html',
    html: wrap,
  });

  const node = graph.addNode({
    x: 80,
    y: 80,
    width: 160,
    height: 60,
    shape: 'html',
    data: {
      time: new Date().toString(),
    },
    html: {
      render(node) { //: Cell
        const data = node.getData(); //as any
        return (
          `<div>
          <span>${data.time}</span>
        </div>`
        );
      },
      shouldComponentUpdate(node) { //: Cell
        // 控制节点重新渲染
        return node.hasChanged('data');
      },
    },
  });
  graph.zoomTo(1.8);
// */
  function render(dslObject) {
    if (dslObject !== null) {
      //console.log(JSON.stringify(dslObject,null,'  '));
    } else {
      return;
    }

    let elkgraph = toElkGraph(dslObject);
    const layout = elkLayout();
    layout.nodeSize(80).portSize(8);

    function refreshFn() {
      layout(elkgraph).then((elkLayoutGraph) => {
        // Clear and redraw
        // reset diagram
        //console.log(JSON.stringify(elkLayoutGraph,null, ' '));
        const result = toX6Graph(elkLayoutGraph);
        //console.log(result);
        //console.log(JSON.stringify(result,null, ' '));
        graph.fromJSON(result);
      }).catch((e) => {
        console.log(e);
      });
    }
    refreshFn();
  }

  return {
    render
  };
}

export function toX6Graph(elkNode) {
  return toX6GraphRec(elkNode);
}

function toX6GraphRec(elkNode) {
  const g = {
    nodes:[], edges:[]
  };

   // Clone node 
  const n = { 
    id: elkNode.id,
    label: elkNode.label,
    data: elkNode.model,
    x: elkNode.ax,
    y: elkNode.ay,
    width: elkNode.width,
    height: elkNode.height,
    attrs: {
      body: {
        class: 'node',
      }  
    }
  };

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
  const items = (elkNode.ports || []).map((p) => {
    const r = {
      group: 'abs',
      id: p.id,
      args: {
        x: p.x + 4,
        y: p.y + 4
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
          class: 'port',
          circle: {
            r: 4,//p.width,
            magnet: false,
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

  const children = [];
  (elkNode.children || []).forEach((c) => {
    children.push(c.id);
    const t = toX6GraphRec(c);
    g.nodes = g.nodes.concat(t.nodes);
    g.edges = g.edges.concat(t.edges);
  }); 

  n.attrs.body.strokeWidth = (children.length > 0) ? '0px' : '1px';
  n.attrs.body.opacity = (children.length > 0) ? 0.15 : 0.9;

  // Edges
  (elkNode.edges || []).forEach((e) => {
    const t = {
        attrs: {
        line: {
          class: 'link',
          targetMarker: {
            name: 'classic',
            size: 8
          }
        }
      }
    };
    t.id = e.id;
    t.data = e.model;
    const source = e.sources[0];
    const target = e.targets[0];
    t.source = { cell: source.replace(/\.(start|finish)/ig,''), port: source };
    t.target = { cell: target.replace(/\.(start|finish)/ig,''), port: target };

    var d = e.sections[0];
    
    if (d.startPoint && d.endPoint) {
     /*
      source: { x: 240, y: 240 },
      target: { x: 280, y: 380 },
      vertices: [{ x: 240, y: 340 }],
      //*/ 
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
    g.edges.push(t);
  });  
  return g;
}


function createX6Graph(containerElt,width,height) {
  const graph = new Graph({
    container: containerElt,
    width: width,
    height: height,
    background: {
      color: '#fff',
    },
    grid: {
      size: 10,
      visible: false,
    }, 
    interacting: false, 
    /*{
      nodeMovable: false,
      edgeMovable: false
    },//*/
    async: false,
    //frozen: true,
    scroller: {
      enabled: true,
      pannable: true,
      pageVisible: true,
      pageBreak: true,
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
      },/*
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              class: 'link',
              stroke: '#999',
              strokeWidth: 1,
              targetMarker: {
                name: 'classic',
                size: 1
              }
            }
          }
        });
      }//*/
    },

  });

  return graph;
}
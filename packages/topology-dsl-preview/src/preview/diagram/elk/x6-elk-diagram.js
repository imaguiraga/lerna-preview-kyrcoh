
import { Graph, Shape } from '@antv/x6';
import { data } from './x6-data.js';
import { toElkGraph, elkLayout } from './elk-layout';

export function createElkX6Renderer(_container_, _width_, _height_, _iconWidth_) {

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800);
  const height = (_height_ || containerElt.scrollHeight || 800);

  const graph = new Graph({
    container: containerElt,
    width: 960,
    height: 800,
    grid: { visible: true },
    scroller: {
      enabled: true,
      pageVisible: true,
      pageBreak: true,
      pannable: true,
    }
  });
  graph.fromJSON(data);
/*
  const graph = new Graph({
    container: containerElt,
    width: width,
    height: height,
    background: {
      color: '#fffbe6',
    },
    grid: {
      size: 10,
      visible: true,
    }, 
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connector: "rounded",
      connectionPoint: "boundary",
      router: {
        name: "er",
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: "#a0a0a0",
              strokeWidth: 1,
              targetMarker: {
                name: "classic",
                size: 4
              }
            }
          }
        });
      }
    },
    scroller: {
      enabled: true,
      pannable: true,
      pageVisible: true,
      pageBreak: false,
    },
    mousewheel: {
      enabled: true,
      modifiers: ['ctrl', 'meta'],
    },
  });
  //*/

  // */
  /*
  const graph = new Graph({
    container: containerElt,
    width: 400,
    grid: { visible: true },
    scroller: {
      enabled: true,
      pageVisible: true,
      pageBreak: false,
      pannable: true,
    },
  
    minimap: {
      enabled: true,
      container: this.minimapContainer,
      width: 200,
      height: 160,
      padding: 10,
      graphOptions: {
        async: true,
        getCellView(cell) {
          if (cell.isNode()) {
            return SimpleNodeView;
          }
        },
        createCellView(cell) {
          if (cell.isEdge()) {
            return null;
          }
        },
      },
    },
  });//*/
/*
  graph.addNode({
    x: 200,
    y: 100,
    width: 100,
    height: 40,
    label: 'Rect',
  });

  const source = graph.addNode({
    x: 32,
    y: 32,
    width: 100,
    height: 40,
    label: 'Hello',
  });

  const target = graph.addNode({
    shape: 'circle',
    x: 160,
    y: 180,
    width: 60,
    height: 60,
    label: 'World',
  });

  graph.addEdge({
    source,
    target,
  });

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
        console.log(result);
        console.log(JSON.stringify(result,null, ' '));

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
        x: p.x + 4,
        y: p.y + 4
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
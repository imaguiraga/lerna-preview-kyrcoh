import './style/elk-style.css';
import { Graph, Shape } from '@antv/x6';
import { toElkGraph, toX6Graph, elkLayout } from './elk-layout-common';
import { initD3, renderd3Layout } from './elk-diagram-d3';
import { data } from './new-data.js';

export function createElkD3Renderer(_container_, _width_, _height_, _iconWidth_) {
  /*
  function viewport() {
    let e = window,
      a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {
      width: e[a + 'Width'],
      height: e[a + 'Height']
    };
  }
  
  let width = viewport().width-20;
  let height = viewport().height-20;
  //*/

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800);
  const height = (_height_ || containerElt.scrollHeight || 800);

  let svg = initD3(containerElt, width, height, iconWidth);

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
        let root = svg.selectAll('g.root');
        // reset diagram
        root.remove();
        root = svg.append('g').attr('class', 'root');

        renderd3Layout(root, elkLayoutGraph, refreshFn);

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

export function createElkX6Renderer(_container_, _width_, _height_, _iconWidth_) {

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800);
  const height = (_height_ || containerElt.scrollHeight || 800);
  const data1 = {
    // 节点
    nodes: [
      {
        id: 'node1',
        x: 40,
        y: 40,
        width: 80,
        height: 40,
        label: 'hello',
        attrs: {
          body: {
            fill: '#2ECC71',
            stroke: '#000',
            strokeDasharray: '10,2',
          },
          label: {
            text: 'Hello',
            fill: '#333',
            fontSize: 13,
          },
        },
      },
      {
        id: 'node2',
        x: 160,
        y: 180,
        width: 80,
        height: 40,
        label: 'world',
        attrs: {
          body: {
            fill: '#F39C12',
            stroke: '#000',
            rx: 16,
            ry: 16,
          },
          label: {
            text: 'World',
            fill: '#333',
            fontSize: 18,
            fontWeight: 'bold',
            fontVariant: 'small-caps',
          },
        },
      },
    ],
    // 边
    edges: [
      {
        source: 'node1',
        target: 'node2',
      },
    ],
  };

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
                size: 7
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
  graph.fromJSON(data);
  //graph.fromJSON(data);
  // */
  /*
  const graph = new Graph({
    container: this.container,
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
        //console.log(JSON.stringify(result,null, ' '));

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
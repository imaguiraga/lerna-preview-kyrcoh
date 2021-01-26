

import { data } from './g6-data.js';
import { toElkGraph, elkLayout } from './elk-layout';
import G6 from '@antv/g6';
import '@antv/util';
const { Graph, Shape } = G6;

import { LineArrowOptions } from './g6-line-arrow';

G6.registerEdge('line-arrow', LineArrowOptions, 'line');
/*
G6.registerNode(
  'iconfont',
  {
    ...ICONFONT_NODE_OPTIONS,
    getAnchorPoints(cfg) {
      // Set Anchor points based on layout direction
      if (cfg.rankdir && (cfg.rankdir === 'LR' || cfg.rankdir === 'RL')) {
        return [
          [1, 0.5],
          [0, 0.5]
        ];
      } else {
        return [
          [0.5, 1],
          [0.5, 0]
        ];
      }
    },
  },
  'single-node'
);

const FLOW_NODE_TYPE = 'flow-elt';

G6.registerNode(
  FLOW_NODE_TYPE,
  {
    ...FLOW_NODE_OPTIONS,
    getAnchorPoints(cfg) {
      // Set Anchor points based on layout direction
      if (cfg.rankdir && (cfg.rankdir === 'LR' || cfg.rankdir === 'RL')) {
        return [
          [1, 0.5],
          [0, 0.5]
        ];
      } else {
        return [
          [0.5, 1],
          [0.5, 0]
        ];
      }
    },
  },
  'single-node'
);
//*/
const DEFAULT_NODE = {
  type: 'rect1',
  size: [80, 80],
  style: {
    stroke: '#5B8FF9',
    fill: '#C6E5FF',
    textColor: '#00287E'
  },
  labelCfg: {
    style: {
      fontSize: 12,
    }
  },
  /* configurations for four linkpoints */
  linkPoints: {
    top: true,
    right: true,
    bottom: true,
    left: true,
    /* linkPoints' size, 8 by default */
       size: 16,
    /* linkPoints' style */
       fill: '#ccc',
       stroke: '#333',
       lineWidth: 2,
  },
};
//*/
const DEFAULT_EDGE = {
  type: 'polyline',
  style: {
    radius: 16,
    offset: 48,
    startArrow: false,
    endArrow: true,
    lineWidth: 3,
    stroke: '#555555'
  }
};
//*/
G6.registerNode(
  'dom-node',
  {
    draw: (cfg/*: ModelConfig*/, group/*: Group*/) => {
      //cfg.x = 0;
      //cfg.y = 0;
      //group.attrs.matrix = [1, 0, 0, 0, 1, 0, cfg.size[0]/2, cfg.size[1]/2, 1];
      return group.addShape('dom', {
        attrs: {
          width: cfg.size[0],
          height: cfg.size[1],
          // DOM's html
          html: `
        <div style="background-color: #fff; border: 2px solid #5B8FF9; border-radius: 5px; width: ${
          cfg.size[0] - 5
        }px; height: ${cfg.size[1] - 5}px; display: flex;">
          <div style="height: 100%; width: 33%; background-color: #CDDDFD">
            <img alt="img" style="line-height: 100%; padding-top: 6px; padding-left: 8px;" src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ" width="20" height="20" />  
          </div>
          <span style="margin:auto; padding:auto; color: #5B8FF9">${cfg.label}</span>
        </div>
          `,
        },
        draggable: true,
      });
    },
  },
  'single-node',
);

G6.registerNode(
  'rect1',
  {/*
    getShapeStyle: function getShapeStyle(cfg) {
      var defaultStyle = this.getOptions(cfg).style;
      var strokeStyle = {
        stroke: cfg.color
      }; // 如果设置了color，则覆盖默认的stroke属性
  
      var style = Object.assign({}, defaultStyle, strokeStyle);
      var size = this.getSize(cfg);
      var width = style.width || size[0];
      var height = style.height || size[1];
      var styles = Object.assign({
        x: -width / 2,
        y: -height / 2,
        width: width,
        height: height
      }, cfg.style);
      return styles;
    },//*/
  
    draw(cfg, group) {
      const size = this.getSize(cfg); // translate to [width, height]
      const color = cfg.color;
      const width = size[0];
      const height = size[1];
      //group.attrs.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      const style = Object.assign(
        {},
        {
          stroke: color,
          width: width,
          height: height
        },
        cfg.style,
      );
      // add a path as keyShape
      const keyShape = group.addShape('rect', {
        attrs: {
          ...style,
        },
        draggable: true,
        name: 'rect-keyShape',
      });
      // return the keyShape
      return keyShape;
    },//*/
  },
  'rect',//'single-node',
);
/**
 * Create a Code.
 * @param {object} _container_ - The container.
 * @param {number} _width_ - The content.
 * @param {number} _height_ - The mode.
 * @return {object} The G6Graph object.
 */
function createGraph(_container_, _width_, _height_) {
  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const width = _width_ || containerElt.scrollWidth || 800;
  const height = _height_ || containerElt.scrollHeight || 800;

  const graphOptions = {
    container: containerElt,
    renderer: 'svg',
    width,
    height,
    defaultNode: DEFAULT_NODE,
    defaultEdge: DEFAULT_EDGE,
    // translate the graph to align the canvas's center, support by v3.5.1
    fitCenter: true,
    // make the edge link to the centers of the end nodes
    linkCenter: false,
    modes: {
      default: [
        'drag-canvas', {
          type: 'zoom-canvas',
          minZoom: 0.002,
          maxZoom: 20
        },
        'drag-node'
      ]
    },
    fitView: true,
    minZoom: 0.002,
    maxZoom: 20
  };

  // Override node default config based on node.tagName
  const graph = new G6.Graph(graphOptions);
  //graph.node(FLOW_NODE_FN);
  //graph.edge(FLOW_EDGE_FN);

  // Instantiate the Minimap plugin
  const minimap = new G6.Minimap();
  graph.addPlugin(minimap);
  graph.fitView(40);

  return graph;
}

export function createElkG6Renderer(_container_, _width_, _height_, _iconWidth_) {

  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800);
  const height = (_height_ || containerElt.scrollHeight || 800);
  const graph = createGraph(containerElt, width, height);

  graph.data(data);
  graph.fitView(20);
  graph.render();
  //*/

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
        const result = toG6Graph(elkLayoutGraph);
        console.log(result);
        console.log(JSON.stringify(result,null, ' '));
        /*
        graph.data(result);
        graph.fitView(20);
        graph.render();
        */

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

export function toG6Graph(elkNode) {
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
    size: [elkNode.width,elkNode.height]
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

  n.children = [];
  elkNode.children = elkNode.children || []; 
  elkNode.children.forEach((c) => {
    n.children.push(c.id);
    const t = toG6Graph(c);
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
    t.source = source.replace(/\.(start|finish)/ig,'');
    t.target = target.replace(/\.(start|finish)/ig,'');

    var d = e.sections[0];
    const vertices = [];
    if (d.startPoint && d.endPoint) {
      vertices.push({ x: d.startPoint.ax, y: d.startPoint.ay });
      (d.bendPoints || []).forEach(function (bp, i) {
        vertices.push({ x: bp.ax, y: bp.ay });
      });
      vertices.push({ x: d.endPoint.ax, y: d.endPoint.ay });
    }
    t.controlPoints = vertices;
    // g.edges.push(t);
  });  
  return g;
}
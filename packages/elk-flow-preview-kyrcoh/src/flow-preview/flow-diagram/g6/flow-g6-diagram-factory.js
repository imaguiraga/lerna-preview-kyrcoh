import G6 from "@antv/g6";

import { 
  FLOW_NODE_OPTIONS,
  FLOW_NODE_FN, 
  FLOW_EDGE_FN
} from "./flow-g6-node-config.js";

import { ICONFONT_NODE_OPTIONS } from "./iconfont-node-config.js";
import { VanillaDagreLayoutOpts } from './layout/dagre-layout';
import { LineArrowOptions } from './line-arrow';

G6.registerEdge('line-arrow',LineArrowOptions,'line');
G6.registerLayout('dagre', VanillaDagreLayoutOpts);

G6.registerNode(
  'iconfont',
  {
    ...ICONFONT_NODE_OPTIONS,
    getAnchorPoints(cfg) {
      // Set Anchor points based on layout direction
      if (cfg.rankdir && (cfg.rankdir === 'LR' || cfg.rankdir === 'RL')) {
        return [
          [1,0.5], 
          [0,0.5]
        ];
      } else {
        return [
          [0.5,1], 
          [0.5,0]
        ];
      }
    },
  }, 
  "single-node"
);

const FLOW_NODE_TYPE = "flow-elt";

G6.registerNode(
  FLOW_NODE_TYPE, 
  {
    ...FLOW_NODE_OPTIONS,
    getAnchorPoints(cfg) {
      // Set Anchor points based on layout direction
      if (cfg.rankdir && (cfg.rankdir === 'LR' || cfg.rankdir === 'RL')) {
        return [
          [1,0.5], 
          [0,0.5]
        ];
      } else {
        return [
          [0.5,1], 
          [0.5,0]
        ];
      }
    },
  }, 
  "single-node"
);

const DEFAULT_NODE = {
      type: FLOW_NODE_TYPE,
      size: [120,60],
      style: {
        stroke:"#5B8FF9",
        fill: "#C6E5FF",
        textColor: "#00287E"
      },
      labelCfg: {
        style: {
          fontSize: 12,
        }
      }
    };

 const DEFAULT_EDGE = {
      type: "polyline",
      style: {
        radius: 16,
        offset: 48,
        startArrow: false,
        endArrow: true,
        lineWidth: 3,
        stroke: "#555555"
      }
    };

G6.Global.nodeStateStyle.selected = {
  stroke: "#d9d9d9",
  fill: "#5394ef"
};

/**
 * Create a Code.
 * @param {object} _container_ - The container.
 * @param {number} _width_ - The content.
 * @param {number} _height_ - The mode.
 * @return {object} The G6Graph object.
 */
export function createFlowDiagram(_container_,_width_,_height_){
  let containerElt = (typeof _container_ === "string") ? document.getElementById(_container_) : _container_;

  const width = _width_ || containerElt.scrollWidth || 800;
  const height = _height_ || containerElt.scrollHeight || 800;

  const graphOptions = {
    container: containerElt,
    width,
    height,
    layout: {
      type: "dagre",
      rankdir: "TB", 
      nodesepFunc: (n) => {
        return 10;
      },
      ranksepFunc: (n) => {
        return 10;
      },
      controlPoints: true,
      nodesep: 80, 
      ranksep: 80,
      offset: 10,
    },
    defaultNode: DEFAULT_NODE,
    defaultEdge: DEFAULT_EDGE,
    modes: {
      default: [
        "drag-canvas", {
          type: "zoom-canvas",
          minZoom: 0.002,
          maxZoom: 20
        }, 
        "drag-node"
      ]
    },
    fitView: true,
    minZoom: 0.002,
    maxZoom: 20
  };

// Override node default config based on node.tagName
  const graph = new G6.Graph(graphOptions);
  graph.node(FLOW_NODE_FN);
  graph.edge(FLOW_EDGE_FN);

  // Instantiate the Minimap plugin
  const minimap = new G6.Minimap();
  graph.addPlugin(minimap);
  graph.fitView(40);
  
  return graph;
}
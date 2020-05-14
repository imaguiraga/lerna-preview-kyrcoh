import G6 from "@antv/g6";
import { 
  PIPELINE_NODE_OPTIONS, 
  PIPELINE_NODE_FN, 
  PIPELINE_EDGE_FN
} from "./pipeline-g6-node-config.js";

import {ICONFONT_NODE_OPTIONS} from "./iconfont-node-config.js";

// Register iconfont and override anchorpoints 
G6.registerNode('iconfont',
  {
    ...ICONFONT_NODE_OPTIONS,
    getAnchorPoints(cfg) {
      // Horizontal layout
      return [
        [1, 0.5], 
        [0, 0.5]
      ];// H
    },
  }, 
  "single-node"
);

const PIPELINE_NODE_TYPE = "pipeline-elt";

G6.registerNode(
  PIPELINE_NODE_TYPE, 
  {
    ...PIPELINE_NODE_OPTIONS,
    getAnchorPoints(cfg) {
      // Horizontal layout
      return [
        [1, 0.5], 
        [0, 0.5]
      ];// H
    },
  }, 
  "single-node"
);

const DEFAULT_NODE = {
  type: PIPELINE_NODE_TYPE,
  style: {
    stroke:"#5B8FF9",
    fill: "#C6E5FF",
    textColor: "#00287E"
  },
  labelCfg: {
    style: {
      fontSize: 14,
    }
  },
};

const DEFAULT_EDGE = {
  //type: "polyline",
  type: "cubic-horizontal",      
  style: {
    radius: 8,
    offset: 24,
    startArrow: false,
    endArrow: true,
    lineWidth: 4,
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
export function createPipelineDiagram(_container_,_width_,_height_){
  let containerElt = (typeof _container_ === "string") ? document.getElementById(_container_) : _container_;

  const width = _width_ || containerElt.scrollWidth || 800;
  const height = _height_ || containerElt.scrollHeight || 800;

  const graphOptions = {
    container: containerElt,
    width,
    height,
    layout: {
      type: "dagre",
      nodesepFunc: (d) => {
        return 64;
      },
      ranksepFunc: (d) => {
        return 64;
      },
      controlPoints: true,
      rankdir: "LR", // H
      //rankdir: "TB", // V
      //align:"UL"
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
  graph.node(PIPELINE_NODE_FN);
  graph.edge(PIPELINE_EDGE_FN);

  // Instantiate the Minimap plugin
  const minimap = new G6.Minimap();
  graph.addPlugin(minimap);
  graph.fitView(40);
  
  return graph;
}
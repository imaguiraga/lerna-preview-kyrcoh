import G6 from "@antv/g6";
import { 
  GET_NODE_CONFIG, 
  NODE_OPTIONS, 
  CUSTOM_NODE_TYPE,
  DEFAULT_NODE, 
  DEFAULT_EDGE 
} from "./flow-g6-node-config.js";

G6.registerNode(
  CUSTOM_NODE_TYPE, NODE_OPTIONS, "single-node"
);

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

  const width = _width_ || 640;
  const height = _height_ || 800;

  const graphOptions = {
    container: containerElt,
    width,
    height,
    layout: {
      type: "dagre",
      nodesepFunc: (d) => {
        return 40;
      },
      ranksep: 60,
      controlPoints: true
    },
    defaultNode: DEFAULT_NODE,
    defaultEdge: DEFAULT_EDGE,
    modes: {
      default: ["drag-canvas", "zoom-canvas", "drag-node"]
    },
    fitView: true,
    minZoom: 0.002,
    maxZoom: 20
  };

// Override node default config based on nodde.tagName
  const graph = new G6.Graph(graphOptions);
  graph.node(GET_NODE_CONFIG);

  // Instantiate the Minimap plugin
  const minimap = new G6.Minimap();
  graph.addPlugin(minimap);
  graph.fitView(40);
  
  return graph;
}
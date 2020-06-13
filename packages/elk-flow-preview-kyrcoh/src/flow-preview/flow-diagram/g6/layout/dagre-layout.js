/**
 * @Modified Version of @antv.g6 dagre layout
 */
import dagre from "dagre";

import isArray from '@antv/util/lib/is-array';
import { isNumber } from '@antv/util';
import mix from '@antv/util/lib/mix';

const DEBUG = false;
function getFunc(
  func,
  value,
  defaultValue,
) {
  let resultFunc;
  if (func) {
    resultFunc = func;
  } else if (isNumber(value)) {
    resultFunc = () => value;
  } else {
    resultFunc = () => defaultValue;
  }
  return resultFunc;
}

export const VanillaDagreLayoutOpts = {
  rankdir: 'TB', // layout TB, BT, LR, RL
  align: undefined, // UL, UR, DL, DR
  nodeSize: undefined, 
  nodesepFunc: undefined, 
  ranksepFunc: undefined, 
  nodesep: 60, 
  ranksep: 60, 
  controlPoints: true, 
  layoutOptions: { },
  offset: 0,

  getDefaultCfg() {
    return {
      rankdir: 'TB', // layout TB, BT, LR, RL
      align: undefined, // UL, UR, DL, DR
      nodeSize: undefined, 
      nodesepFunc: undefined, 
      ranksepFunc: undefined, 
      nodesep: 60, 
      ranksep: 60, 
      controlPoints: true, 
      layoutOptions: { },
      offset: 0,
    };
  },

  /**
   * Execute the layout
   */
   execute() {
    const self = this;
    const { nodes, nodeSize, rankdir } = self;

    if (!nodes) return;
    const edges = self.edges || [];
    const g = new dagre.graphlib.Graph();

    let nodeSizeFunc = undefined;
    if (!nodeSize) {
      nodeSizeFunc = (d) => {
        if (d.size) {
          if (isArray(d.size)) {
            return d.size;
          }
          return [d.size, d.size];
        }
        return [40, 40];
      };
    } else if (isArray(nodeSize)) {
      nodeSizeFunc = () => nodeSize;
    } else {
      nodeSizeFunc = () => [nodeSize, nodeSize];
    }
    
    let horisep = getFunc(self.nodesepFunc, 0/*self.nodesep*/, 0);
    let vertisep= getFunc(self.ranksepFunc, 0/*self.ranksep*/, 0);
 
    if (rankdir === 'LR' || rankdir === 'RL') {
      horisep = getFunc(self.ranksepFunc, 0/*self.ranksep*/, 0);
      vertisep = getFunc(self.nodesepFunc, 0/*self.nodesep*/, 0);
    }//*/
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph(self);
    nodes.forEach(node => {
      const size = nodeSizeFunc(node);
      const verti = vertisep(node);
      const hori = horisep(node);
      const width = size[0] + 2 * hori;
      const height = size[1] + 2 * verti;
      node.rankdir = rankdir;
      g.setNode(node.id, { width, height });
    });

    edges.forEach(edge => {
      // dagrejs Wiki https://github.com/dagrejs/dagre/wiki#configuring-the-layout
      g.setEdge(edge.source, edge.target, {
        name: edge.id,
        weight: edge.weight || 1,      
      });
    });
    dagre.layout(g);

    let coord;
    g.nodes().forEach((node) => {
      coord = g.node(node);
      const i = nodes.findIndex(it => it.id === node);
      nodes[i].x = coord.x;
      nodes[i].y = coord.y;    
    });
    g.edges().forEach((edge) => {
      coord = g.edge(edge);
      if(DEBUG){
        console.log(`edge{${edge.v}-${edge.w}} - ${JSON.stringify(coord)} - ${self.offset}`);
      }
      
      let source = g.node(edge.v);
      let target = g.node(edge.w);
      ///https://github.com/dagrejs/graphlib/wiki/API-Reference
      const i = edges.findIndex(it => it.source === edge.v && it.target === edge.w);
      let e = edges[i];
      if (self.controlPoints && e.type !== 'loop' && e.shape !== 'loop') {
        let len = coord.points.length;
        //e.controlPoints = coord.points.slice(1, len - 1);
        // Control point are already computed by the layout
        e.controlPoints = coord.points;
        // Add an offset to 1st and last controlpoint
        if (rankdir === 'TB') {
          e.controlPoints[0].x = source.x;
          e.controlPoints[0].y = source.y + (source.height/2+self.offset);

          e.controlPoints[len - 1].x = target.x;
          e.controlPoints[len - 1].y = target.y - (target.height/2+self.offset);
        } else if (rankdir === 'BT') {
          e.controlPoints[0].x = source.x;
          e.controlPoints[0].y = source.y - (source.height/2+self.offset);

          e.controlPoints[len - 1].x = target.x;
          e.controlPoints[len - 1].y = target.y + (target.height/2+self.offset);

        } else if (rankdir === 'LR') {

          e.controlPoints[0].x = source.x + (source.width/2+self.offset);
          e.controlPoints[0].y = source.y;

          e.controlPoints[len - 1].x = target.x - (target.width/2+self.offset);
          e.controlPoints[len - 1].y = target.y;
        } else if (rankdir === 'RL') {
          e.controlPoints[0].x = source.x - (source.width/2+self.offset);
          e.controlPoints[0].y = source.y;

          e.controlPoints[len - 1].x = target.x + (target.width/2+self.offset);
          e.controlPoints[len - 1].y = target.y;
        }
        if(DEBUG){
          console.log(`edge -> {${edge.v}-${edge.w}} - ${JSON.stringify(e.controlPoints)} - ${self.offset}`);
        }
        
      }

    });
  },
    /**
   * Initialize
   * @param {Object} data The data
   */
  init(data) {
    const self = this;
    self.nodes = data.nodes;
    self.edges = data.edges;
  },

  /**
   * Layout with the data
   * @param {Object} data The data
   */
  layout(data) {
    const self = this;
    self.init(data);
    self.execute();
  },
  /**
   * Update the configurations of the layout, but it does not execute the layout
   * @param {Object} cfg The new configurations
   */
  updateCfg(cfg) {
    const self = this;
    mix(self, cfg);
  },
  /**
   * Destroy the layout
   */
  destroy() {
    const self = this;
    self.positions = null;
    self.nodes = null;
    self.edges = null;
    self.destroyed = true;
  },
};

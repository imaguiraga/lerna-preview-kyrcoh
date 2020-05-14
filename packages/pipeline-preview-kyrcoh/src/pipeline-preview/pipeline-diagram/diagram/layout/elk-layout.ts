/**
 * @fileOverview elkjs layout
 * @author anonymous
 */
//https://github.com/eclipse/elk
//https://www.eclipse.org/elk/
//https://github.com/kieler/elkjs
import G6 from "@antv/g6";

import isArray from '@antv/util/lib/is-array';
import { isNumber } from '@antv/util';

import ELK from 'elkjs';

const { BaseLayout } = G6.Layout;

export default class ELKLayout extends BaseLayout {

  /** 节点大小 */
  public nodeSize: number | number[] | undefined;

  /** 节点水平间距(px) */
  public nodesep: number = 50;
  /** 每一层节点之间间距 */
  public ranksep: number = 50;
  /** 是否保留布局连线的控制点 */
  public controlPoints: boolean = false;

  public layoutOptions: any = { 'elk.algorithm': 'layered' };

  public getDefaultCfg() {
    return {
      nodeSize: undefined, // 节点大小
      nodesep: 50, // 节点水平间距(px)
      ranksep: 50, // 每一层节点之间间距
      controlPoints: false, // 是否保留布局连线的控制点
      layoutOptions: { 'elk.algorithm': 'layered' },
    };
  }

  /**
   * 执行布局
   */
  public execute() {
    const elk = new ELK();
    const self = this;
    const { nodes, nodeSize, rankdir } = self;
    if (!nodes) return;
    const edges = self.edges || [];
    const g = {
      id: "root",
      layoutOptions: { 'elk.algorithm': 'layered' },
      children: [
        /*
        { id: "n1", width: 30, height: 30 },
        { id: "n2", width: 30, height: 30 },
        { id: "n3", width: 30, height: 30 }
        */
      ],
      edges: [
        /*
        { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
        { id: "e2", sources: [ "n1" ], targets: [ "n3" ] }*/
      ]
    };

    let nodeSizeFunc: (d?: any) => number[];
    if (!nodeSize) {
      nodeSizeFunc = (d: any) => {
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

    nodes.forEach(node => {
      const size = nodeSizeFunc(node);
      const width = size[0] ;
      const height = size[1];
      g.children.push({
        id: node.id, width, height 
      });
    });

    edges.forEach(edge => {
      // elkjs Wiki https://github.com/kieler/elkjs
      g.edges.push({
        sources: [edge.source], 
        tragets: [edge.target],
      });
    });
    elk.layout(g);

    // Map yo g6 coordinates
    g.children.forEach((node: any) => {
      const i = nodes.findIndex(it => it.id === node);
      nodes[i].x = node.x;
      nodes[i].y = node.y;
    });
    g.edges.forEach((edge: any) => {
      const i = edges.findIndex(it => it.source === edge.incomingShape && it.target === edge.outgingShape);
      if (self.controlPoints) {
        edges[i].bendPoints = edge.endPoints;
      }

      edges[i].starPoint = edge.startPoint;
      edges[i].endPoint = edge.endPoint;
      edges[i].bendPoints = edge.endPoints;
    });
  }

}


function getFunc(
  func: ((d?: any) => number) | undefined,
  value: number,
  defaultValue: number,
): Function {
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


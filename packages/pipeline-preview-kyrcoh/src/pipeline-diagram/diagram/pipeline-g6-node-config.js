import G6 from "@antv/g6";

const pipelineEltNodeOptions = {
  drawShape(cfg, group) {
    let w = cfg.width || 150;
    let h = cfg.height || 50;

    const rect = group.addShape("rect", {
      attrs: {
        x: (-1 * w) / 2,
        y: (-1 * h) / 2,
        width: w,
        height: h,
        radius: 8,
        stroke: cfg.style.stroke || "#5B8FF9",
        fill: cfg.style.fill || "#C6E5FF",
        lineWidth: 2
      },
      name: "rect-shape"
    });

    return rect;
  }
};

const NODE_TAGNAME_CONFIG = new Map([
  // Job
  ["job.start", {
    style: {
      fill: "#7e3ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["job.finish", {
    style: {
      fill: "#7e3ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Stage
  ["stage.start", {
    style: {
      fill: "#774ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["stage.finish", {
    style: {
      fill: "#774ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Sequence
  ["sequence.start", {
    style: {
      fill: "#7e3ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["sequence.finish", {
    style: {
      fill: "#7e3ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["step.terminal", {
    style: {
      fill: "#774ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["data.terminal", {
    style: {
      fill: "#774ff2",
      stroke: "#5300e8"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }]
]);

export const GET_NODE_CONFIG = function(node) {
  // Compute stroke and textColor
  if(NODE_TAGNAME_CONFIG.has(node.model.tagName)) {
    return NODE_TAGNAME_CONFIG.get(node.model.tagName);
  }

  return {};
};

export const NODE_OPTIONS = pipelineEltNodeOptions;
export const CUSTOM_NODE_TYPE = "pipeline-elt";
export const DEFAULT_NODE = {
      type: CUSTOM_NODE_TYPE,
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
      linkPoints: {
        left: true,
        right: true,
        fill: "#fff",
        stroke: "#1890FF",
        size: 3
      },
      anchorPoints: [[1, 0.5], [0, 0.5]]
    };
export const DEFAULT_EDGE = {
  type: "curveline",
      //type: "polyline",
      //type: "cubic-horizontal",
      style: {
        radius: 16,
        offset: 20,
        endArrow: true,
        lineWidth: 2,
        stroke: "#C2C8D5"
      }
    };

    G6.registerEdge("line2", {
      draw: function draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
    
        const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
        const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
        const endArrow = (cfg.style && cfg.style.endArrow) || undefined;
    
        const keyShape = group.addShape("path", {
          attrs: {
            path: [
              ["M", startPoint.x, startPoint.y],
              ["L", startPoint.x, (endPoint.y + startPoint.y) / 2],
              ["L", endPoint.x, (endPoint.y + startPoint.y) / 2],
              ["L", endPoint.x, endPoint.y]
            ],
            stroke,
            lineWidth: 2,
            startArrow,
            endArrow
          },
          className: "edge-shape",
          name: "edge-shape"
        });
        return keyShape;
      }
    });

    function getCubicPath(cfg){
      let paths = [ ];
      const radius = (cfg.style && cfg.style.radius) || 0;
      const offset = (cfg.style && cfg.style.offset) || 20;

      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      // dir LR
      if(startPoint.y === endPoint.y){
        paths = [
          ["M", startPoint.x, startPoint.y],
          ["L", endPoint.x, endPoint.y]
        ];
      } else {
        let k = 1;
        if(startPoint.y < endPoint.y) { //TB
         k = 1;
        } else {
          k = -1;
        }
        paths = [
          ["M", startPoint.x, startPoint.y],
          ["l", offset, 0],
          ["q", radius,0 , radius,k*radius],
          ["l", 0, endPoint.y - startPoint.y - k*2*radius],
          ["q", 0,k*radius,radius,k*radius],
          ["L", endPoint.x, endPoint.y]
        ];
      } 
      return paths;
    }

    function getCubicPathbak(cfg){
      let paths = [ ];
      const radius = (cfg.style && cfg.style.radius) || 0;
      const offset = (cfg.style && cfg.style.offset) || 20;

      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      // dir LR
      if(startPoint.y === endPoint.y){
        paths = [
          ["M", startPoint.x, startPoint.y],
          ["L", endPoint.x, endPoint.y]
        ];
      } else if(startPoint.y < endPoint.y) { //TB
        paths = [
          ["M", startPoint.x, startPoint.y],
          ["L", startPoint.x+offset, startPoint.y+0],
          ["Q", startPoint.x+offset+radius,startPoint.y , 
            startPoint.x+offset+radius,startPoint.y + radius],
          ["L", startPoint.x+offset+radius,endPoint.y - radius],
          ["Q", startPoint.x+offset+radius,endPoint.y,
            startPoint.x+offset+radius+radius,endPoint.y],
          ["L", endPoint.x, endPoint.y]
        ];
      } else {
        paths = [
          ["M", startPoint.x, startPoint.y],
          ["L", startPoint.x+offset, startPoint.y+0],
          ["Q", startPoint.x+offset+radius,startPoint.y , 
            startPoint.x+offset+radius,startPoint.y - radius],
          ["L", startPoint.x+offset + radius,endPoint.y + radius],
          ["Q", startPoint.x+offset+radius,endPoint.y,
            startPoint.x+offset+radius+radius,endPoint.y],
          ["L", endPoint.x, endPoint.y]
        ];
      }
      return paths;
    }

    G6.registerEdge("curveline", {
      draw: function draw(cfg, group) {
      
        const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
        const startArrow = (cfg.style && cfg.style.startArrow) || undefined;
        const endArrow = (cfg.style && cfg.style.endArrow) || undefined;
        
        const keyShape = group.addShape("path", {
          attrs: {
            path: getCubicPath(cfg),
            stroke,
            lineWidth: 2,
            startArrow,
            endArrow
          },
          className: "edge-shape",
          name: "edge-shape"
        });
        return keyShape;
      }
    });    
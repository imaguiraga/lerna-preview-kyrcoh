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
  },
  getAnchorPoints(cfg) {
    return [
      [1, 0.5], 
      [0, 0.5]
    ];// H
      //anchorPoints: [[0.5, 1], [0.5,0]] // V
  }
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
        size: 2
      }
    };
    
export const DEFAULT_EDGE = {
  type: "curveline",
      //type: "polyline",
      //type: "cubic-horizontal",
      style: {
        radius: 16,
        offset: 16,
        endArrow: true,
        lineWidth: 2,
        stroke: "#666666"
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
  // Pipeline
  ["pipeline.start", {
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
  ["pipeline.finish", {
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
    // Compute label Width and Height
    //let width = (node.label.length + 4) * 12;
    return NODE_TAGNAME_CONFIG.get(node.model.tagName);
  }

  return {};
};
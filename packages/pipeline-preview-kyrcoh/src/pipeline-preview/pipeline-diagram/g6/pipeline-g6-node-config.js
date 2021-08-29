import "../../style/font-awesome-4.7.0/css/font-awesome.css";

export const PIPELINE_NODE_OPTIONS = {
  drawShape(cfg, group) {
    let w = (cfg.style && cfg.style.width) || 120;
    let h = (cfg.style && cfg.style.height) || 64;

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
};

const START_ICON = '\uf192'; // dot-circle-o  
const END_ICON = '\uf111'; // circle    
const ICON_SIZE = 48;

const STAGE_STYLE = {
  fill: "#9E2B0E",
  stroke: "#9E2B0E",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const JOB_STYLE = {
  fill: "#1D7324",
  stroke: "#1D7324",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const PIPELINE_STYLE = {
  fill: "#5300e8",
  stroke: "#5300e8",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const NODE_CONFIG_MAP = new Map([
  // Job
  ["job.start", {
    type: 'iconfont',
    text: START_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: JOB_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["job.finish", {
    type: 'iconfont',
    text: END_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: JOB_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Stage
  ["stage.start", {
    type: 'iconfont',
    text: START_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: STAGE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["stage.finish", {
    type: 'iconfont',
    text: END_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: STAGE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Sequence
  ["sequence.start", {
    type: 'iconfont',
    text: START_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: PIPELINE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["sequence.finish", {
    type: 'iconfont',
    text: END_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: PIPELINE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Pipeline
  ["pipeline.start", {
    type: 'iconfont',
    text: START_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: PIPELINE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["pipeline.finish", {
    type: 'iconfont',
    text: END_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: PIPELINE_STYLE,
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

const EDGE_CONFIG_MAP = new Map([
  // Choice
  ["stage", {
    style: {
      stroke: STAGE_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Parallel
  ["job", {
    style: { 
      stroke: JOB_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Sequence
  ["pipeline", {
    style: {
      stroke: PIPELINE_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }]
]);

export const PIPELINE_NODE_FN = function(node) {
  // Compute stroke and textColor
  let result = {};
  if(node.model && node.model.tagName) {
    let key = node.model.tagName + (node.model.tagName? "."+node.model.tagName: "");
    if(NODE_CONFIG_MAP.has(key)) {
      result = NODE_CONFIG_MAP.get(key);
    }
  }

  return result || {};
};

export const PIPELINE_EDGE_FN = function(edge) {
  let result = {};

  // if source and target have the same tagName use the source stroke color
  if(edge.model && edge.model.tagName && EDGE_CONFIG_MAP.has(edge.model.tagName)) {
    result = EDGE_CONFIG_MAP.get(edge.model.tagName);
  }
  return result || {};
};

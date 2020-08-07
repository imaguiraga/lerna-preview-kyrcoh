import "../../style/font-awesome-4.7.0/css/font-awesome.css";

export const FLOW_NODE_OPTIONS = {
  drawShape(cfg, group) {
    let w = (cfg.style && cfg.style.width) || 120;
    let h = (cfg.style && cfg.style.height) || 60;

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

const START_ICON = '\uf192'; // dot-circle-o  
const END_ICON = '\uf111'; // circle
const LOOP_ICON = '\uf0e2';// undo
const SKIP_ICON = '\uf096'; // square-o 

const ICON_SIZE = 40;

const CHOICE_STYLE =  {
  fill: "#A82255",
  stroke: "#A82255",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const PARALLEL_STYLE = {
  fill: "#5300e8",
  stroke: "#5300e8",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const SEQUENCE_STYLE = {
  fill: "#5300e8",
  stroke: "#5300e8",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const OPTIONAL_STYLE = {
  fill: "#1D7324",
  stroke: "#1D7324",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const REPEAT_STYLE = {
  fill: "#ba00e5",
  stroke: "#ba00e5",
  fontFamily: 'FontAwesome', // font-family: "iconfont";
};

const NODE_CONFIG_MAP = new Map([
  // Choice
  ["choice.start", {
    type: 'iconfont',
    text: START_ICON,
    size: ICON_SIZE,
    label: "" ,
    style: CHOICE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["choice.finish", {
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
    style: CHOICE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Parallel
  ["parallel.start", {
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
    style: PARALLEL_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  ["parallel.finish", {
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
    style: PARALLEL_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Sequence
  ["sequence.start", {
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
    style: SEQUENCE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["sequence.finish", {
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
    style: SEQUENCE_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  // Optional 
  ["optional.start", {
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
    style: OPTIONAL_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["optional.skip", {
    type: 'iconfont',
    text: SKIP_ICON, // square-o   
    size: ICON_SIZE,
    label: "",//"skip" ,
    style: OPTIONAL_STYLE,
    labelCfg: {
      style: {
        fill: "#000000"
      }
    }
  }],
  ["optional.finish", {
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
    style: OPTIONAL_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Repeat
  ["repeat.start", {
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
    style: REPEAT_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["repeat.loop", {
    type: 'iconfont',
    text: LOOP_ICON,// undo
    size: ICON_SIZE,
    label: "" ,//"loop"
    style: REPEAT_STYLE,
    labelCfg: {
      style: {
        fill: "#ffffff"
      }
    }
  }],
  ["repeat.finish", { 
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
    style: REPEAT_STYLE,
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }]
]);

const EDGE_CONFIG_MAP = new Map([
  // Choice
  ["choice", {
    style: {
      stroke: CHOICE_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Parallel
  ["parallel", {
    style: { 
      stroke: PARALLEL_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Sequence
  ["sequence", {
    style: {
      stroke: SEQUENCE_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Optional 
  ["optional", {
    style: {
      stroke: OPTIONAL_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],

  // Repeat
  ["repeat", {
    style: {
      stroke: REPEAT_STYLE.stroke
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }]
]);

export const FLOW_NODE_FN = function(node) {
  // Compute stroke and textColor
  let result = {};
  if(node.model && node.model.resourceType) {
    let key = node.model.resourceType + (node.model.tagName? "."+node.model.tagName: "");
    if(NODE_CONFIG_MAP.has(key)) {
      result = NODE_CONFIG_MAP.get(key);
    }
  }

  return result || {};
};

export const FLOW_EDGE_FN = function(edge) {
  let result = {};

  // if source and target have the same resourcetype use the source stroke color
  if(edge.model && edge.model.resourceType && EDGE_CONFIG_MAP.has(edge.model.resourceType)) {
    result = EDGE_CONFIG_MAP.get(edge.model.resourceType);
  }
  return result || {};
};
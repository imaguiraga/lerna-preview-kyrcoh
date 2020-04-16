const flowEltNodeOptions =    {
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

export const NODE_OPTIONS = flowEltNodeOptions;
export const CUSTOM_NODE_TYPE = "flow-elt";
export const DEFAULT_NODE = {
      type: CUSTOM_NODE_TYPE,
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

export const DEFAULT_EDGE = {
      type: "polyline",
      style: {
        radius: 10,
        offset: 45,
        endArrow: true,
        lineWidth: 2,
        stroke: "#555555"
      }
    };

const START_ICON = '\uf192'; // dot-circle-o  
const END_ICON = '\uf111'; // circle
const ICON_SIZE = 40;

const NODE_TAGNAME_CONFIG = new Map([
  // Choice
  ["choice.start", {
    type: 'iconfont',
    text: START_ICON,
    size: ICON_SIZE,
    label: "" ,
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
  ["choice.finish", {
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
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
  // Parallel
  ["parallel.start", {
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
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
  ["parallel.finish", {
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
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
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
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
    type: 'iconfont',
    text: END_ICON,// circle
    size: ICON_SIZE,
    label: "" ,
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
  // Optional 
  ["optional.start", {
    type: 'iconfont',
    text: START_ICON,// dot-circle-o
    size: ICON_SIZE,
    label: "" ,
    style: {
      fill: "#aaf255",
      stroke: "#61d800"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["optional.skip", {
    type: 'iconfont',
    text: '\uf096', // square-o   
    size: ICON_SIZE,
    label: "",//"skip" ,
    style: {
      fill: "#000000",
      //fill: "#aaf255",
      //stroke: "#61d800",
    },
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
    style: {
      fill: "#aaf255",
      stroke: "#61d800"
    },
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
    style: {
      fill: "#df55f2",
      stroke: "#ba00e5"
    },
    labelCfg: {
      style: {
        fill: "#FFFFFF"
      }
    }
  }],
  ["repeat.loop", {
    type: 'iconfont',
    text: '\uf0e2',// undo
    size: ICON_SIZE,
    label: "" ,//"loop"
    style: {
      fill: "#df55f2",
      stroke: "none",
    },
    backgroundConfigx: {
        fill: "#df55f2",
        stroke: "#ba00e5",    
    },
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
    style: {
      fill: "#df55f2",
      stroke: "#ba00e5"
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

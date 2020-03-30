const flowEltNodeOptions =    {
  drawShape(cfg, group) {
    const rect = group.addShape("rect", {
      attrs: {
        x: -75,
        y: -25,
        width: 150,
        height: 50,
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
  // Choice
  ["choice.start", {
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
  // Optional 
  ["optional.start", {
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
  ["optional.finish", {
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
  ["repeat.finish", {
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
        stroke: "#C2C8D5"
      }
    };
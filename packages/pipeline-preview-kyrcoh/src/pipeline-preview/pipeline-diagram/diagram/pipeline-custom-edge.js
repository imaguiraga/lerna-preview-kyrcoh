
export const CUSTOMLINE = {
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
};

function getCubicPath(cfg) {
  return getHCubicPath(cfg);//H
}

function getHCubicPath(cfg) {
  let paths = [];
  const r = (cfg.style && cfg.style.radius) || 8;
  const offset = (cfg.style && cfg.style.offset) || 8;

  const sp = cfg.startPoint;
  const ep = cfg.endPoint;
  // LR
  if (sp.x < ep.x) {
    if (sp.y === ep.y) {
      paths = [
        ["M", sp.x, sp.y],
        ["L", ep.x, ep.y]
      ];
    } else {
      let k = 1;
      if (sp.y < ep.y) { // UD
        k = 1;
      } else { // DU
        k = -1;
      }
      paths = [
        ["M", sp.x, sp.y],
        ["l", (ep.x - sp.x - offset - 2 * r), 0],
        ["q", r, 0, r, k * r],
        ["l", 0, ep.y - sp.y - k * 2 * r],
        ["q", 0, k * r, r, k * r],
        ["L", ep.x, ep.y]
      ];
    }

  } else { // RL

    if (sp.y === ep.y) {
      paths = [
        ["M", sp.x, sp.y],
        ["L", ep.x, ep.y]
      ];
    } else {
      let k = 1;
      if (sp.y < ep.y) { // UD
        k = 1;
      } else { // DU
        k = -1;
      }
      paths = [
        ["M", sp.x, sp.y],
        ["l", (ep.x - sp.x + offset + 2 * r), 0],
        ["q", -1*r, 0, -1*r, k * r],
        ["l", 0, ep.y - sp.y - k * 2 * r],
        ["q", 0, k * r, -1*r, k * r],
        ["L", ep.x, ep.y]
      ];
    }
  }
  return paths;
}

// eslint-disable-next-line
function getVCubicPath(cfg) {
  let paths = [];
  const r = (cfg.style && cfg.style.radius) || 8;
  const offset = (cfg.style && cfg.style.offset) || 8;

  const sp = cfg.startPoint;
  const ep = cfg.endPoint;
  // UD
  if (sp.y < ep.y) {
    if (sp.x === ep.x) {
      paths = [
        ["M", sp.x, sp.y],
        ["L", ep.x, ep.y]
      ];
    } else {
      let k = 1;
      if (sp.x < ep.x) { // LR
        k = 1;
      } else { // RL
        k = -1;
      }
      paths = [
        ["M", sp.x, sp.y],
        ["l", 0, (ep.y - sp.y - offset - 2 * r)],
        ["q", 0, r, k * r, r],
        ["l", ep.x - sp.x - k * 2 * r,0],
        ["q", k * r, 0, k * r, r],
        ["L", ep.x, ep.y]
      ];
    }

  } else { // DU

    if (sp.x === ep.x) {
      paths = [
        ["M", sp.x, sp.y],
        ["L", ep.x, ep.y]
      ];
    } else {
      let k = 1;
      if (sp.x < ep.x) { // LR
        k = 1;
      } else { // RL
        k = -1;
      }
      paths = [
        ["M", sp.x, sp.y],
        ["l", 0, (ep.y - sp.y + offset + 2 * r )],
        ["q", 0, -1*r, k * r, -1*r],
        ["l", ep.x - sp.x - k * 2 * r, 0],
        ["q", k * r, 0, k * r, -1*r],
        ["L", ep.x, ep.y]
      ];
    }
  }
  return paths;
}

export const CURVELINE = {
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
};


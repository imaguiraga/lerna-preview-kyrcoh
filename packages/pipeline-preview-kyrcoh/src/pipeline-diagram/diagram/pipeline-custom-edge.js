
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
  let paths = [];
  const radius = (cfg.style && cfg.style.radius) || 0;
  const offset = (cfg.style && cfg.style.offset) || 10;

  const startPoint = cfg.startPoint;
  const endPoint = cfg.endPoint;
  // dir LR
  if (startPoint.x < endPoint.x) {
    if (startPoint.y === endPoint.y) {
      paths = [
        ["M", startPoint.x, startPoint.y],
        ["L", endPoint.x, endPoint.y]
      ];
    } else {
      let k = 1;
      if (startPoint.y < endPoint.y) { // UD
        k = 1;
      } else { // DU
        k = -1;
      }
      paths = [
        ["M", startPoint.x, startPoint.y],
        ["l", (endPoint.x - startPoint.x - offset), 0],
        ["q", radius, 0, radius, k * radius],
        ["l", 0, endPoint.y - startPoint.y - k * 2 * radius],
        ["q", 0, k * radius, radius, k * radius],
        ["L", endPoint.x, endPoint.y]
      ];
    }

  } else { // RL
    if (startPoint.y === endPoint.y) {
      paths = [
        ["M", startPoint.x, startPoint.y],
        ["L", endPoint.x, endPoint.y]
      ];
    } else {
      let k = 1;
      if (startPoint.y < endPoint.y) { // UD
        k = 1;
      } else { // DU
        k = -1;
      }
      paths = [
        ["M", startPoint.x, startPoint.y],
        ["l", (endPoint.x - startPoint.x + offset), 0],
        ["q", -1*radius, 0, -1*radius, k * radius],
        ["l", 0, endPoint.y - startPoint.y - k * 2 * radius],
        ["q", 0, k * radius, -1*radius, k * radius],
        ["L", endPoint.x, endPoint.y]
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


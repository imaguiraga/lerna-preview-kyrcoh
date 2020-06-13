//G6.registerNode('iconfont',
export const ICONFONT_NODE_OPTIONS = {
  draw(cfg, group) {
    const { backgroundConfig: backgroundStyle, style, labelCfg: labelStyle } = cfg;
    let size = cfg.size || 64;
    let w = size;
    let h = size;
    const boxShape = group.addShape("rect", {
      attrs: {
        x: (-1 * w) / 2,
        y: (-1 * h) / 2,
        width: w,
        height: h,
        radius: 8,
        //stroke: cfg.style.stroke || "#5B8FF9",
        //lineWidth: 2
        ...backgroundStyle,
      },
      name: "box-shape"
    });

    /*if (backgroundStyle) {
      const boxShape = group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: cfg.size/2,
          ...backgroundStyle,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'circle-shape',
      });
    }//*/

    group.addShape('text', {
      attrs: {
        x: 0,
        y: 0,
        textAlign: 'center',
        textBaseline: 'middle',
        text: cfg.text,
        fontSize: size-8,
        ...style,
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'text-shape1',
    });
   // const labelY = backgroundStyle ? cfg.size * 2 : cfg.size;

    group.addShape('text', {
      attrs: {
        x: 0,
        y: 0,//labelY,
        textAlign: 'center',
        textBaseline: 'middle',
        text: cfg.label,
        ...labelStyle.style,
      },
      // must be assigned in G6 3.3 and later versions. it can be any value you want
      name: 'text-shape2',
    });
    return boxShape;
  },
};

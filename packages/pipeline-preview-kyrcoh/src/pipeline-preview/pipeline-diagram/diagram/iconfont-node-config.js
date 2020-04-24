//G6.registerNode('iconfont',
 export const ICONFONTNODE_CONFIG = {
  draw(cfg, group) {
    const { backgroundConfig: backgroundStyle, style, labelCfg: labelStyle } = cfg;

    if (backgroundStyle) {
      group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: cfg.size/2,
          ...backgroundStyle,
        },
        // must be assigned in G6 3.3 and later versions. it can be any value you want
        name: 'circle-shape',
      });
    }

    const keyShape = group.addShape('text', {
      attrs: {
        x: 0,
        y: 0,
        fontFamily: 'FontAwesome', // font-family: "iconfont";
        textAlign: 'center',
        textBaseline: 'middle',
        text: cfg.text,
        fontSize: cfg.size-8,
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
    return keyShape;
  }
};

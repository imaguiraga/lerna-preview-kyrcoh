import G6 from '@antv/g6';

export const LineArrowOptions = {
    getPath(points) {
      const path = [];
      for(let i = 0; i < points.length;i++ ){
        let p = points[i];
        if( i=== 0){
          path.push(['M', p.x, p.y]);
        } else {
          path.push(['L', p.x, p.y]);
        }
      }
      return path;
    },
    getShapeStyle(cfg) {
      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;
      const controlPoints = this.getControlPoints(cfg);
      let points = [startPoint]; 
      
      if ((typeof controlPoints) === 'array') {
        points = points.concat(controlPoints);
      }
      points.push(endPoint);
      const path = this.getPath(points);
      const style = Object.assign(
        {},
        G6.Global.defaultEdge.style,
        {
          stroke: '#BBB',
          lineWidth: 1,
          path,
        },
        cfg.style,
      );
      return style;
    },
    getControlPoints(cfg) {
      return cfg.controlPoints;
    },
  };
import * as d3 from 'd3';

const EMPTY_ARRAY = [];

const idFn = function (d) { return d.id.replace(/\.|:/gi, '_'); };
const isIconFn = function (n) {
  return (n && n.model && n.model.tagName === 'mark');
};

// Helper functions
const portsFn = function (n) {
  // by default the 'ports' field
  if (Array.isArray(n.ports) && n.ports.length > 1) {
    n.ports[0].isIcon = false;//n.model.compound;
    n.ports[1].isIcon = false;
  }
  return n.ports || [];
};

const labelsFn = function (n) {
  return n.labels || [];
};

const nodesFn = function (n) {
  return n.children || [];
};

const linksFn = function (n) {
  return n.edges || [];
};

function drawNode(selection, d, i, refreshFn) {
  // Toggle expansion on/off
  const collapseNode = function (d) {
    d3.event.stopPropagation();

    // is expanded
    if (d.model.compound) {
      // Remove children and edges 
      d._children = d.children;
      d.children = EMPTY_ARRAY;

      d._edges = d.edges;
      d.edges = null;
      d.model.compound = false;
      d.collapsed = true;

    } else if (d.collapsed) {
      // Restore children and edges
      d.children = d._children;
      d._children = null;

      d.edges = d._edges;
      d._edges = null;
      d.model.compound = true;
      d.collapsed = false;
    }

    refreshFn();
  };

  // extract class names from tagName
  if (d.model) {
    selection.classed(d.model.provider, true);
    selection.classed(d.model.resourceType, true);
    //selection.classed(d.model.tagName,true);
    selection.classed(
      d.model.subType,
      true//d.model.subType !== undefined && d.model.subType !== d.model.resourceType
    );
    if (d.model.compound === true || d.collapsed) {
      selection.on('click', collapseNode);
    }
  }
  // Node type  
  if (isIconFn(d)) {

    selection.append('rect')
      .attr('class', 'node')
      .style('fill', 'inherit')
      .style('stroke', 'inherit')
      .attr('x', function (d) { return 0; })
      .attr('y', function (d) { return 0; })
      .attr('width', function (d) { return d.width; })
      .attr('height', function (d) { return d.height; });

  } else {

    // Draw icon in the corner for compound
    let x = 2;
    let y = 2;
    let w = d.width - 4;
    let h = d.height - 4;
    let fill = 'inherit';
    let stroke = 'transparent';

    if (d.children.length > 0) {
      h = 24;
      w = 24;
      x = d.width / 2;
      y = -h / 2;

      fill = 'inherit';
      stroke = 'inherit';
    } else {
      fill = 'white';
      stroke = 'black';
    }

    if (d._children) {
      fill = 'inherit';
    }
    // Draw the background
    let style = d.model.data.get('style');

    selection.append('rect')
      .attr('class', 'node')
      .style('fill', fill)
      .style('stroke', stroke)
      .style('opacity', '0.6')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', function (d) { return d.width; })
      .attr('height', function (d) { return d.height; })
      // .attr('rx', 8)
      .append('metadata')
      .text((d) => {
        return JSON.stringify(d.model, null, ' ');
      });
    // IconPath
    let iconPath = style ? encodeURI(style.iconURL) : null;
    // If icon exist
    if (iconPath && iconPath !== null) {
      selection.append('image')
        .attr('class', 'node')
        .style('fill', 'inherit')
        .style('stroke', 'inherit')
        .attr('href', iconPath)
        //.attr('x', function (d) { return x; })
        .attr('x', function (d) { return 2; })
        .attr('y', function (d) { return y; })
        //.attr('width', function (d) { return w; })
        .attr('width', function (d) { return h - 2; })
        .attr('height', function (d) { return h - 2; });
    }

    if (d.children.length === 0) {
      const fo = selection.append('foreignObject')
        //.attr('class', 'node')
        .style('fill', fill)
        .style('stroke', stroke)
        .attr('x', function (d) { return h; })
        .attr('y', function (d) { return y; })
        .attr('width', function (d) { return d.width - h; })
        .attr('height', function (d) { return d.height - 2; });
      // text placeholder
      fo.append('xhtml:div').attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .attr('width', function (d) { return d.width - h; })
        .attr('height', function (d) { return d.height - 2; })
        .style('padding', '4px')
        .html(
          `<div><code>${style && style.product ? style.product : ''}</code></div>
        <div><code style='font-weight:bold;font-size:1.5em'>${d.model ? d.model.title : ''}</code></div>`);
    }
  }
}

function drawLabel(selection, d, i, refreshFn) {
  // Create new selection from current one
  /*
    selection.selectAll('.label').data((d, i) => {
      return labelsFn(d);
    }).enter()
      .append('text')
      .attr('class', 'label')
      .text((l) => l.text)
      .style('stroke-width', 1)
      .style('font-size', '1.5em')
      .attr('x', (l) => l.x)
      .attr('y', (l) => l.y)
      .attr('width', (l) => l.width)
      .attr('height', (l) => l.height);
  // */
  const padding = 4;
  selection.selectAll('.label').data((d, i) => {
    return labelsFn(d).map((l) => {
      //l.width = 3 * 80;
      return l;
    });
  }).enter().append('foreignObject')
    .attr('class', 'label')
    //.attr('class', 'node')
    .style('fill', 'white')
    .style('stroke', 'black')
    .attr('x', (l) => l.x)
    .attr('y', (l) => l.y)
    //.attr('width', (l) => l.width)
    .attr('width', (l) => 3 * 80)
    .attr('height', (l) => l.height + 2 * padding)
    // text placeholder
    .append('xhtml:div').attr('xmlns', 'http://www.w3.org/1999/xhtml')
    .style('font-size', '1.5em')
    .style('border', '1px solid black')
    .style('background', 'white')
    //.attr('width', (l) => l.width)
    .attr('width', (l) => 3 * 80)
    .attr('height', (l) => l.height)
    .style('padding', '4px')
    .html((l) =>
      `<code>${l.text}</code>`
    );
  //*/
}

function drawPort(selection, d, i, refreshFn) {
  // Create new selection from current one
  selection.selectAll('.port').data((d, i) => {
    return portsFn(d);
  }).enter().each(function (d, i) {
    // Update current selection attributes
    let selection = d3.select(this);
    if (d.isIcon) {
      selection.append('image')
        .attr('class', 'port')
        .attr('href', (l) => {
          return 'icons/App Engine.svg';
        })
        .attr('x', (l) => l.x)
        .attr('y', (l) => l.y)
        .attr('width', (l) => l.width)
        .attr('height', (l) => l.height);

    } else {
      selection.append('rect')
        .attr('class', 'port')
        .attr('x', (l) => l.x)
        .attr('y', (l) => l.y)
        .attr('width', (l) => l.width)
        .attr('height', (l) => l.height);
    }
  });
  /*
    .append('rect')
    .attr('class','port')
    .attr('x', (l) => l.x)
    .attr('y', (l) => l.y)
    .attr('width', (l) => l.width)
    .attr('height', (l) => l.height);
    //*/

}

export function renderd3Layout(svg, node, refreshFn) {
  if (node === null) {
    return;
  }
  // Get current children nodes and links
  var nodes = nodesFn(node);
  var links = linksFn(node);

  // Add edges
  if (links) {
    var linkData = svg.append('g').attr('class', 'edges').selectAll('.link').data(links, idFn);

    var linkEnter = linkData.enter()
      .append('path')
      .attr('class', 'link')
      .attr('marker-start', function (d) {
        if (d.style.startArrow) {
          return 'url(#end)';
        }
        return '';
      })
      .attr('marker-end', function (d) {
        if (d.style.endArrow) {
          return 'url(#end)';
        }
        return '';
      })
      .attr('d', function (e) {
        var path = '';
        var d = e.sections[0];
        if (d.startPoint && d.endPoint) {
          path += `M${d.startPoint.x} ${d.startPoint.y} `;
          (d.bendPoints || []).forEach(function (bp, i) {
            path += `L${bp.x} ${bp.y} `;
          });
          path += `L${d.endPoint.x} ${d.endPoint.y} `;
        }
        return path;
      });
    // Sytle edge
    /*
    linkEnter.call(function(selection) { 
      let d = selection.datum();
      // extract class names from tagName
      if(d.model){
        selection.classed(d.model.provider,true);
        selection.classed(d.model.resourceType,true);
      }       
    });//*/
    linkEnter.each(function (d, i) {
      // Update current selection attributes
      let selection = d3.select(this);
      // extract class names from tagName
      if (d.model) {
        selection.classed(d.model.provider, true);
        selection.classed(d.model.resourceType, true);
        selection.classed(d.model.subType, true);
      }
    });
  }
  // Add nodes
  if (nodes) {
    var nodeData = svg.selectAll('.node').data(nodes, idFn);

    var nodeEnter = nodeData.enter()
      .append('g')
      .attr('class', function (d) {
        let c = 'leaf';
        if (nodesFn(d).length > 0) {
          c = 'compound container';
        }
        return c;
      }).each(function (d, i) {
        // Update current selection attributes
        let selection = d3.select(this);
        drawNode(selection, d, i, refreshFn);
        // Labels
        drawLabel(selection, d, i, refreshFn);
        // Ports
        drawPort(selection, d, i, refreshFn);

      })
      .attr('transform', function (d) {
        return `translate(${(d.x || 0)} ${(d.y || 0)})`;
      }).attr('id', function (d) {
        return idFn(d);
      });

    // Add title  
    nodeEnter.append('title')
      .text(function (d) { return d.id; });

    nodeEnter.each(function (n, i) {
      // If node has children make a recursive call
      if (nodesFn(n).length > 0) {
        renderd3Layout(d3.select(this), n, refreshFn);
      }
    });
  }
}

function createMarkers(defs, iconWidth) {
  defs.append('marker')
    .attr('id', 'end')
    .attr('viewBox', '-4 0 8 8')
    //.attr('viewBox', '0 0 8 8')
    .attr('refX', 4)
    .attr('refY', 4)
    .attr('markerWidth', 4)      // marker settings
    .attr('markerHeight', 4)
    .attr('orient', 'auto-start-reverse')
    .style('fill', 'black')
    .style('stroke-opacity', 1)  // arrowhead color
    .append('path')
    .attr('d', 'M -4 0 L 4 4 L -4 8 z');
  //.attr('d', 'M 0 0 L 8 4 L 0 8 z'); 

  defs.append('circle')
    .attr('id', 'start')
    .attr('viewBox', `0 0 ${iconWidth} ${iconWidth}`)
    //.attr('width', iconWidth)
    //.attr('height', iconWidth)
    .style('fill', 'transparent')
    .style('stroke', 'inherit')
    .style('stroke-width', '2px')
    .attr('cx', iconWidth / 2)
    .attr('cy', iconWidth / 2)
    .attr('r', 8);

  defs.append('circle')
    .attr('id', 'finish')
    .attr('viewBox', `0 0 ${iconWidth} ${iconWidth}`)
    //.attr('width', ${iconWidth})
    //.attr('height', ${iconWidth})
    .style('fill', 'inherit')
    .style('stroke', 'transparent')
    .style('stroke-width', '2px')
    .attr('cx', iconWidth / 2)
    .attr('cy', iconWidth / 2)
    .attr('r', 8);

  //*/
  defs.append('rect')
    .attr('id', 'start1')
    .attr('viewBox', `0 0 ${iconWidth} ${iconWidth}`)
    .style('fill', 'transparent')
    .style('stroke', 'inherit')
    .style('stroke-width', '2px')
    .attr('width', iconWidth - 2)
    .attr('height', iconWidth - 2)
    .attr('x', 2)
    .attr('y', 2)
    .attr('rx', 2);

  defs.append('rect')
    .attr('id', 'finish1')
    .attr('viewBox', `0 0 ${iconWidth} ${iconWidth}`)
    .style('fill', 'inherit')
    .style('stroke', 'transparent')
    .style('stroke-width', '2px')
    .attr('width', iconWidth - 2)
    .attr('height', iconWidth - 2)
    .attr('x', 2)
    .attr('y', 2)
    .attr('rx', 2);

  defs.append('rect')
    .attr('id', 'skip1')
    .attr('viewBox', `0 0 ${iconWidth} ${iconWidth}`)
    .style('fill', 'inherit')
    .style('stroke', 'transparent')
    .style('stroke-width', '2px')
    .attr('width', iconWidth - 2)
    .attr('height', iconWidth - 2)
    .attr('x', 2)
    .attr('y', 2)
    .attr('rx', 2);

  defs.append('rect')
    .attr('id', 'loop1')
    .attr('viewBox', `0 0 ${iconWidth} ${iconWidth}`)
    .style('fill', 'inherit')
    .style('stroke', 'transparent')
    .style('stroke-width', '2px')
    .attr('width', iconWidth - 2)
    .attr('height', iconWidth - 2)
    .attr('x', 2)
    .attr('y', 2)
    .attr('rx', 2);
}

export function initD3(containerElt, width, height, iconWidth) {
  const zoomFn = d3.zoom().on('zoom', function () {
    d3.select(this).select('g').attr('transform', d3.event.transform);
  });

  let svg = d3.select(containerElt)
    .append('svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .classed('svg-content', true)
    .call(zoomFn)
    .append('g');
  // define an arrow head
  let defs = svg.append('defs');
  createMarkers(defs, iconWidth);

  return svg;
}
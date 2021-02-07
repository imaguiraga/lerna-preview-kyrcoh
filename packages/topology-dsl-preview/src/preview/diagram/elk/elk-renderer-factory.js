import './style/x6-elk-style.css';

import { toElkGraph, elkLayout } from './elk-layout-factory';
import { initD3, renderd3Layout } from './d3-elk-renderer';
import { createElkX6Renderer } from './x6-elk-renderer';

export function createElkRenderer(_container_, _width_, _height_, _iconWidth_) {
  return createElkX6Renderer(_container_, _width_, _height_, _iconWidth_);
}

function createElkD3Renderer(_container_, _width_, _height_, _iconWidth_) {
  let containerElt = (typeof _container_ === 'string') ? document.getElementById(_container_) : _container_;

  const iconWidth = _iconWidth_ || 24;
  const width = (_width_ || containerElt.scrollWidth || 800);
  const height = (_height_ || containerElt.scrollHeight || 800);

  let svg = initD3(containerElt, width, height, iconWidth);

  function render(dslObject) {
    if (dslObject !== null) {
      //console.log(JSON.stringify(dslObject,null,'  '));
    } else {
      return;
    }

    let elkgraph = toElkGraph(dslObject);
    const layout = elkLayout();
    layout.nodeSize(80).portSize(8);

    function refreshFn() {
      layout(elkgraph).then((elkLayoutGraph) => {
        // Clear and redraw
        let root = svg.selectAll('g.root');
        // reset diagram
        root.remove();
        root = svg.append('g').attr('class', 'root');

        renderd3Layout(root, elkLayoutGraph, refreshFn);

      }).catch((e) => {
        console.log(e);
      });
    }
    refreshFn();
  }

  return {
    render
  };
}

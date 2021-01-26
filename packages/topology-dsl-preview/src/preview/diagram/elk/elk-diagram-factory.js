import './style/elk-style.css';

import { toElkGraph, elkLayout } from './elk-layout';
import { initD3, renderd3Layout } from './d3-elk-diagram';
import { createElkX6Renderer } from './x6-elk-diagram';
import { createElkG6Renderer } from './g6-elk-diagram';


export function createElkRenderer(_container_, _width_, _height_, _iconWidth_) {
  return createElkX6Renderer(_container_, _width_, _height_, _iconWidth_);
}

function createElkD3Renderer(_container_, _width_, _height_, _iconWidth_) {
  /*
  function viewport() {
    let e = window,
      a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {
      width: e[a + 'Width'],
      height: e[a + 'Height']
    };
  }
  
  let width = viewport().width-20;
  let height = viewport().height-20;
  //*/

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

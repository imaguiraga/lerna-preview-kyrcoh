//const ELK = require('elkjs');
import ELK from 'elkjs/lib/elk.bundled.js';
import './style/elk-style.css';

import {
  FlowToELKVisitor,
  ELKDimensionVisitor
} from '../visitor/index.js';

import { init, renderd3Layout } from './elk-diagram-d3';

const elkvisitor = new FlowToELKVisitor();

export function createElkRenderer(_container_, _width_, _height_, _iconWidth_) {
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

  let svg = init(containerElt, width, height, iconWidth);

  function toElkGraph(dslObject) {
    let elkgraph = null;
    try {
      // dslObject to elkgraph
      elkgraph = elkvisitor.toElkGraph(dslObject);
    } catch (e) {
      console.error(e);
    }
    return elkgraph;
  }

  function elkLayout() {
    const elkDimensionVisitor = new ELKDimensionVisitor();
    const elk = new ELK();
    let options = {
      'algorithm': 'layered',
      'nodePlacement.strategy': 'NETWORK_SIMPLEX', //'BRANDES_KOEPF'
      'port.borderOffset': 4,
      'padding': 20,
      'edgeRouting': 'ORTHOGONAL',
      'layered.mergeEdges': true,
      'zoomToFit': true,
      'spacing': 40,
      'spacing.nodeNodeBetweenLayers': 40,
      'spacing.edgeNodeBetweenLayers': 40,
      'spacing.edgeEdgeBetweenLayers': 40,
      'layering.strategy': 'LONGEST_PATH',
      'spacing.labelNode': 8
    };
    //https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-layering-strategy.html
    //https://www.eclipse.org/elk/reference/options/org-eclipse-elk-layered-nodeplacement-strategy.html
    function layoutFn(inelkgraph) {
      if (inelkgraph === null ) {
        return Promise.resolve(null);
      }
      // Add node width.height
      let elkgraph = elkDimensionVisitor.visit(inelkgraph);
      if (elkgraph === null ) {
        return Promise.resolve(null);
      }
      //console.log(JSON.stringify(elkgraph,null,'  '));

      elk.knownLayoutOptions().then((d) => {
        //console.log(d);
      });
      // start the layout
      let elkpromise = elk.layout(elkgraph, {
        layoutOptions: options,
        logging: true,
        measureExecutionTime: true
      });

      return elkpromise;
    }

    layoutFn.nodeHeight = function (newSize) {
      if (!arguments.length) return elkDimensionVisitor._nodeHeight;
      elkDimensionVisitor.nodeHeight(newSize);
      return this;
    };

    layoutFn.nodeWidth = function (newSize) {
      if (!arguments.length) return elkDimensionVisitor._nodeWidth;
      elkDimensionVisitor.nodeWidth(newSize);
      return this;
    };

    layoutFn.nodeSize = function (width, height) {
      if (!arguments.length) return [elkDimensionVisitor._nodeWidth, elkDimensionVisitor._nodeHeight];

      elkDimensionVisitor.nodeWidth(width);
      elkDimensionVisitor.nodeHeight(height || width);

      return this;
    };

    layoutFn.portSize = function (newSize) {
      if (!arguments.length) return elkDimensionVisitor._portSize;
      elkDimensionVisitor.portSize(newSize);
      return this;
    };

    layoutFn.options = function (newOptions) {
      if (!arguments.length) {
        return options;
      }
      options = newOptions;
      return this;
    };

    return layoutFn;
  }

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

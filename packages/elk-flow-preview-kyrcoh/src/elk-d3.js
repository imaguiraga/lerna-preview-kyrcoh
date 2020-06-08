import * as d3 from "d3";
//const ELK = require('elkjs');
import ELK from 'elkjs/lib/elk.bundled.js';
export const elkmodule = {};

// Copies a variable number of methods from source to target.
const rebind = function(target, source) {
  var i = 1, n = arguments.length, method;
  while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
  return target;
};

// Method is assumed to be a standard D3 getter-setter:
// If passed with no arguments, gets the value.
// If passed with arguments, sets the value and returns the target.
function d3_rebind(target, source, method) {
  return function() {
    var value = method.apply(source, arguments);
    return value === source ? target : value;
  };
}

(function (elk) {

  elk.d3kgraph = function () {
    return init("kgraph");
  };
  function init(type) {
    const d3elk = {};
    const dispatch = d3.dispatch("finish");

    var graph = {}; // internal (hierarchical graph)
    var ports = function (n) {
      // by default the 'ports' field
      return n.ports || [];
    };
    var labels = function (n) {
      return n.labels || [];
    };
    var options = {};
    // dimensions
    var width = 0;
    var height = 0;
    var defaultNodeSize = [10, 10];
    var defaultPortSize = [4, 4];
    var transformGroup;

    // a function applied after each layout run
    var applyLayout = function () { };

    // the layouter instance with web worker
    const layouter1 = new ELK({
      workerUrl: './elk-worker.min.js'
    });
    const layouter = new ELK();
    /**
     * Setting the available area, the
     * positions of the layouted graph
     * are currently scaled down.
     */
    d3elk.size = function (size) {
      if (!arguments.length) return [width, height];
      width = size[0];
      height = size[1];
      return d3elk;
    };
    /**
     * Sets the group used to perform 'zoomToFit'.
     */
    d3elk.transformGroup = function (g) {
      if (!arguments.length) return transformGroup;
      transformGroup = g;
      return d3elk;
    };
    d3elk.options = function (opts) {
      if (!arguments.length) return options;
      options = opts;
      return d3elk;
    };

    /*
     * KGraph
     * Allows to use the JSON KGraph format
     */
    if (type === "kgraph") {
      d3elk.nodes = function () {
        var queue = [null,graph],
          nodes = [],
          parent;
        // note that svg z-index is document order, literally
        while ((parent = queue.pop()) !== null) {
          nodes.push(parent);
          (parent.children || []).forEach(function (c) {
            queue.push(c);
          });
        }
        return nodes;
      };
      d3elk.links = function (nodes) {
        return d3.merge(nodes.map(function (n) {
          return n.edges || [];
        }));
      };

      d3elk.kgraph = function (root) {
        applyLayout = d3_kgraph_applyLayout;

        // start the layouter
        layouter.layout(root, {
          layoutOptions: options,
          logging: true,
          measureExecutionTime: true
        }).then(function (kgraph) {
          graph = kgraph;
          applyLayout(kgraph);

        }).catch(function (e) {
          console.error(e);
        });

        return d3elk;
      };

      /**
       * Apply layout for the kgraph style.
       * Converts relative positions to absolute positions.
       */
      var d3_kgraph_applyLayout = function (kgraph) {
        zoomToFit(kgraph);
        var nodeMap = {};
        // convert to absolute positions
        toAbsolutePositions(kgraph, { x: 0, y: 0 }, nodeMap);
        toAbsolutePositionsEdges(kgraph, nodeMap);
        // invoke the 'finish' event
        dispatch.call("finish",{ graph: kgraph },kgraph);
      };
      var toAbsolutePositions = function (n, offset, nodeMap) {
        n.x = (n.x || 0) + offset.x;
        n.y = (n.y || 0) + offset.y;
        nodeMap[n.id] = n;
        // the offset for the children has to include padding
        var childOffset = { x: n.x, y: n.y };
        if (n.padding) {
          childOffset.x += n.padding.left || 0;
          childOffset.y += n.padding.top || 0;
        }
        // children
        (n.children || []).forEach(function (c) {
          c.parent = n;
          toAbsolutePositions(c, childOffset, nodeMap);
        });
      };
      var isDescendant = function (node, child) {
        if(node !== undefined && child !== undefined){
          var parent = child.parent;
          while (parent) {
            if (parent === node) {
              return true;
            }
            parent = parent.parent;
          }
        }
        return false;
      };
      var toAbsolutePositionsEdges = function (n, nodeMap) {
      };
      //@TODO
      var toAbsolutePositionsEdgesbak = function (n, nodeMap) {
        // edges
        (n.edges || []).forEach(function (e) {
          // transform edge coordinates to absolute coordinates. Note that
          //  node coordinates are already absolute and that
          //  edge coordinates are relative to the source node's parent node
          //  (unless the target node is a descendant of the source node)
          var srcNode = nodeMap[e.source];
          var tgtNode = nodeMap[e.target];
          var relative = isDescendant(srcNode, tgtNode) ?
            srcNode : srcNode.parent;
          var offset = { x: 0, y: 0 };
          if (relative) {
            offset.x = relative.x;
            offset.y = relative.y;
          }
          if (relative.padding) {
            offset.x += relative.padding.left || 0;
            offset.y += relative.padding.top || 0;
          }
          // ... and apply it to the edge
          if (e.sourcePoint) {
            e.sourcePoint.x += offset.x || 0;
            e.sourcePoint.y += offset.y || 0;
          }
          if (e.targetPoint) {
            e.targetPoint.x += offset.x || 0;
            e.targetPoint.y += offset.y || 0;
          }
          (e.bendPoints || []).forEach(function (bp) {
            bp.x += offset.x;
            bp.y += offset.y;
          });
        });
        // children
        (n.children || []).forEach(function (c) {
          toAbsolutePositionsEdges(c, nodeMap);
        });
      };
    };

    /**
     * If a top level transform group is specified,
     * we set the scale such that the available
     * space is used to its maximum.
     */
    function zoomToFit(kgraph) {
      // scale everything so that it fits the specified size
      var scale = width / kgraph.width || 1;
      var sh = height / kgraph.height || 1;
      if (sh < scale) {
        scale = sh;
      }
      // if a transformation group was specified we
      // perform a 'zoomToFit'
      if (transformGroup) {
        transformGroup.attr("transform", "scale(" + scale + ")");
      }
    }
    // return the layouter object
    return rebind(d3elk, dispatch, "on");
  }
  if (typeof module === "object" && module.exports) {
    module.exports = elk;
  }
  return elk;
})(elkmodule);
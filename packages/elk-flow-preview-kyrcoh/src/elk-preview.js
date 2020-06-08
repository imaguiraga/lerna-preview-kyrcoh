import * as d3 from "d3";
import {elkmodule} from './elk-d3.js';
import './elk-style.css';

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
//debugger;
let width = viewport().width;
let height = viewport().height;

let idfun = function(d) { return d.id; };    

const zoomFn = d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform);
});
let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoomFn)
    .append("g");
// define an arrow head
svg.append("svg:defs")
     .append("svg:marker")
      .attr("id", "end")
      .attr("viewBox", "0 -10 20 20")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)        // marker settings
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .style("fill", "#999")
      .style("stroke-opacity", 0.6)  // arrowhead color
     .append("svg:path")
      .attr("d", "M0,-10L20,0L0,10");
// group shizzle
let root = svg.append("g");

// load the data and render the elements
d3.json("pipeline.json").then( function(graph) {  

  const options = {
    "elk.algorithm": "layered",
    "nodePlacement.strategy": "BRANDES_KOEPF",
    "org.eclipse.elk.port.borderOffset":10,
    "org.eclipse.elk.layered.mergeEdges":true,
    "spacing": 40,
    "spacing.nodeNodeBetweenLayers": 40,
    "spacing.edgeNodeBetweenLayers": 40,
    "spacing.edgeEdgeBetweenLayers": 40,
    "layering.strategy": "LONGEST_PATH"
  };
  
  
  let layouter = elkmodule.d3kgraph()
    .size([width, height])
    .transformGroup(root)
    .options(options);

    layouter.on("finish", function(d) {
      renderd3Layout(layouter);
    });
  
    // start an initial layout
    layouter.kgraph(graph);
  
});

function renderd3Layout(layouter){
  var nodes = layouter.nodes();
  var links = layouter.links(nodes);

  var linkData = root.selectAll(".link")
    .data(links, idfun);

  var linkEnter = linkData.enter()
    .append("path")
    .attr("class", "link")
    .attr("marker-end", "url(#end)").attr("d", function(e) {
      var path = "";
      var d = e.sections[0];
      if (d.startPoint && d.endPoint) {
        path += "M" + d.startPoint.x + " " + d.startPoint.y + " ";
          (d.bendPoints || []).forEach(function(bp, i) {
            path += "L" + bp.x + " " + bp.y + " ";
          });
        path += "L" + d.endPoint.x + " " + d.endPoint.y + " ";
      }
      return path;
    });

  var nodeData = root.selectAll(".node")
      .data(nodes, idfun);
  
  var nodeEnter = nodeData.enter()
      .append("g")
      .attr("class", function(d) { 
        if (d.children) return "node compound"; else return "node leaf"; 
      })
  .attr("transform", function(d) { return "translate(" + (d.x || 0) + " " + (d.y || 0) + ")"});
      
  var atoms = nodeEnter.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", 0)
      .attr("y", 0)
  .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; });

  nodeEnter.append("title")
      .text(function(d) { return d.id; });  
}

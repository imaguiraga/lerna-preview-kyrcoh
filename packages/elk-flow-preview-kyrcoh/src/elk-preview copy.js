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
let width = viewport().width,
    height = viewport().height;
let zoom = d3.zoom()
    .on("zoom", redraw); 
let idfun = function(d) { return d.id; };    

let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    .append("g");

// group shizzle
let root = svg.append("g");

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


var layoutGraph;
// load the data and render the elements
d3.json("hierarchy.json").then( function(graph) {  

    layoutGraph = graph;
  
    layouter.on("finish", function(d) {
  
      var nodes = layouter.nodes();
      var links = layouter.links(nodes);
  
      // #1 add the nodes' groups
      var nodeData = root.selectAll(".node")
          .data(nodes,  function(d) { return d.id; });
  
      var nodeEnter = nodeData.enter()
          .append("g")
          .attr("class", function(d) {
            if (d.children)
              return "node compound";
            else
              return "node leaf";
          }).attr("transform", function(d) { return "translate(" + (d.x || 0) + " " + (d.y || 0) + ")"});
          var atoms = node.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("x", 0)
          .attr("y", 0);
      // add representing boxes for nodes
      var box = nodeEnter.append("rect")
          .attr("class", "atom")
          .attr("transform", function(d) {
            return "translate(" + (d.x || 0) + " " + (d.y || 0) + ")";
          }).attr("width", function(d) { return d.width; })
          .attr("height", function(d) { return d.height; });
  
      // add node labels
      /*
      nodeEnter.append("text")
          .attr("x", 2.5)
          .attr("y", 6.5)
          .text(function(d) { return d.id; })
          .attr("font-size", "4px");
  //*/
  
      // #2 add paths with arrows for the edges
      var linkData = root.selectAll(".link")
          .data(links, function(d) { return d.id; });
          
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
  
      // #3 update positions of all elements
  
      // node positions
     
      // node sizes
   
  
    });
  
    // start an initial layout
    layouter.kgraph(graph);
  
});

function redraw() {
  svg.attr("transform", `translate(${d3.event.translate}) scale(${d3.event.scale})`);
}
/*
(function layout() {
  layouter.options(options)
          .kgraph(layoutGraph);
})();//*/

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

let width = viewport().width-20;
let height = viewport().height-20;

let idfun = function(d) { return d.id; };    

const zoomFn = d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform);
});
let svg = d3.select("body")
    .append("svg")
    .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
    .attr("width", width)
    .attr("height", height)
    .call(zoomFn)
    .append("g");
// define an arrow head
let defs = svg.append("defs");
defs.append("marker")
  .attr("id", "end")
  .attr("viewBox", "0 0 10 10")
  .attr("refX", 5)
  .attr("refY", 5)
  .attr("markerWidth", 4)        // marker settings
  .attr("markerHeight", 4)
  .attr("orient", "auto")
  .style("fill", "black")
  .style("stroke-opacity", 1)  // arrowhead color
  .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z");

defs.append("circle")
.attr("id", "start")
  //.attr("viewBox", "0 -10 20 20")
  .style("fill", "transparent")
  .style("stroke", "inherit")
  .style("stroke-width", "2px")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 4);
//*/
  
defs.append("symbol")
.attr("id", "s-start")
  .attr("viewBox", "0 0 16 16")
  .style("fill", "transparent")
  .style("stroke", "inherit")
  .attr("width", 16)
  .attr("height", 16)
  .append("circle")
    .style("fill", "transparent")
    .style("stroke", "inherit")
    .style("stroke-width", "2px")
    .attr("cx", 8)
    .attr("cy", 8)
    .attr("r", 4);
    //*/

defs.append("rect")
  .attr("id", "finish")
    //.attr("viewBox", "0 -10 20 20")
    .style("fill", "inehrit")
    .style("stroke", "transparent")
    .style("stroke-width", "0")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 8)
    .attr("height", 8)
    .attr("radius", 2);
  // group shizzle  
// group shizzle
let root = svg.append("g");

const START_ICON = '\uf192'; // dot-circle-o  
const END_ICON = '\uf111'; // circle
const LOOP_ICON = '\uf0e2';// undo
const SKIP_ICON = '\uf096'; // square-o 
const ICONMAP = new Map([
  ["start",START_ICON],
  ["finish",END_ICON],
  ["loop",LOOP_ICON],
  ["skip",SKIP_ICON]
]);
// load the data and render the elements
//d3.json("hierarchy.json").then( function(graph) {  
d3.json("flow.json").then( function(graph) {  
  let options = {
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

  options = {"org.eclipse.elk.edgeRouting": "ORTHOGONAL"};
  
  
  let layouter = elkmodule.d3kgraph()
    .size([width, height])
    .transformGroup(root)
    .options(options);

    layouter.on("finish", function(node) {
      renderd3Layoutv2(root,node);
    });
  
    // start an initial layout
    layouter.kgraph(graph);
  
});

function renderd3Layoutv2(svg,node){
  // Get current children nodes and links
  var nodes = node.children;
  var links = node.edges;

// Add edges
  if(links){
    var linkData = svg.selectAll(".link").data(links, idfun);

    var linkEnter = linkData.enter()
      .append("path")
      .attr("class", "link")
      .attr("marker-end", "url(#end)")
      .attr("d", function(e) {
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
      // Sytle edge
      linkEnter.call(function(selection) { 
        let d = selection.datum();
        console.log("link "+d.model.tagName);
        // extract class names from tagName
        if(d.model && d.model.tagName){
          selection.attr("class", function(d) { 
            return "link "+d.model.resourceType+" "+d.model.tagName.replace(/\./gi," ");
          });
        }       
      });
    }
// Add nodees
    if(nodes){
      var nodeData = svg.selectAll(".node").data(nodes, idfun);
      
      var nodeEnter = nodeData.enter()
        .append("g")
        .attr("class", function(d) { 
          let c = "node leaf";
          if (d.children) {
            c = "node compound";
          } 
          // extract class names from tagName
          if(d.model && d.model.tagName){
            c = c+" "+ d.model.resourceType+" "+d.model.tagName.replace(/\./gi," ");
          }   
          return c;    
        })
        .attr("transform", function(d) { 
          return "translate(" + (d.x || 0) + " " + (d.y || 0) + ")";
        });
          /*
      var atoms = nodeEnter.append("rect")
        .style("fill", "inehrit")
        .style("stroke", "inehrit")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 8)
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; });
          //*/
      nodeEnter.call((sel) => {
          let iconRegex = new RegExp("start|finish|loop|skip");
        // Style node
           // if node has an icon 
          //let sel = d3.selection(this); 
          let data = sel.datum();
          if(data && data.model && iconRegex.test(data.model.tagName)){
            console.log("each icon ==> "+data.id);
            let tagName = data.model.resourceType+" "+data.model.tagName.replace(/\./gi," ").trim();
            let tmp = tagName.split(" ");
            let suffix = tmp[tmp.length-1];
            let icon = sel.append("use").datum(data)
            .style("fill", "inehrit")
            .style("stroke", "inehrit")
            .attr("xlink:href", "#"+suffix)
            .attr("x", function(d) { return d.width/2; })
            .attr("y", function(d) { return d.height/2; })
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; });

            //sel.append(icon);
  
          } else {                
            console.log("each rect ==> "+data.id);
            var leaf = sel.append("rect").datum(data)
            .style("fill", "inehrit")
            .style("stroke", "inehrit")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .attr("rx", 8);
          }       
        });
        //*/
      // if node has an icon
  
      nodeEnter.append("title")
          .text(function(d) { return d.id; });  

      nodeEnter.each(function(n,i){
        // If node has children make a recursive call
        if(n.children){
          renderd3Layoutv2(d3.select(this),n);
        }
        //console.log(n);
      });    
    }
}
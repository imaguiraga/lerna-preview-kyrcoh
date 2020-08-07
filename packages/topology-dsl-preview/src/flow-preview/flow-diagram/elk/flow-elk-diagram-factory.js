import * as d3 from "d3";
import {elkmodule} from './elk-d3.js';
import './elk-style.css';

export function createElkRenderer(_container_,_width_,_height_,_iconWidth_){
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

let containerElt = (typeof _container_ === "string") ? document.getElementById(_container_) : _container_;

const iconWidth = _iconWidth_ || 24;
const width = (_width_ || containerElt.scrollWidth || 800);
const height = (_height_ || containerElt.scrollHeight || 800);

const idFn = function(d) { return d.id.replace(/\.|:/gi,"_"); };    

const zoomFn = d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform);
});
let svg = d3.select(containerElt)
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
  .attr("viewBox", "-4 0 8 8")
  //.attr("viewBox", "0 0 8 8")
  .attr("refX", 4)
  .attr("refY", 4)
  .attr("markerWidth", 4)      // marker settings
  .attr("markerHeight", 4)
  .attr("orient", "auto")
  .style("fill", "black")
  .style("stroke-opacity", 1)  // arrowhead color
  .append("path")
  .attr("d", "M -4 0 L 4 4 L -4 8 z"); 
    //.attr("d", "M 0 0 L 8 4 L 0 8 z"); 

defs.append("circle")
  .attr("id", "start")
  .attr("viewBox", `0 0 ${iconWidth} ${iconWidth}`)
  //.attr("width", iconWidth)
  //.attr("height", iconWidth)
  .style("fill", "transparent")
  .style("stroke", "inherit")
  .style("stroke-width", "2px")
  .attr("cx", iconWidth/2)
  .attr("cy", iconWidth/2)
  .attr("r", 8);

defs.append("circle")
    .attr("id", "finish")
    .attr("viewBox", `0 0 ${iconWidth} ${iconWidth}`)
    //.attr("width", ${iconWidth})
    //.attr("height", ${iconWidth})
    .style("fill", "inherit")
    .style("stroke", "transparent")
    .style("stroke-width", "2px")
    .attr("cx", iconWidth/2)
    .attr("cy", iconWidth/2)
    .attr("r", 8);
     
//*/
defs.append("rect")
    .attr("id", "start1")
    .attr("viewBox", `0 0 ${iconWidth} ${iconWidth}`)
    .style("fill", "transparent")
    .style("stroke", "inherit")
    .style("stroke-width", "2px")
    .attr("width", iconWidth-2)
    .attr("height", iconWidth-2)
    .attr("x", 2)
    .attr("y", 2)
    .attr("rx", 2);

defs.append("rect")
    .attr("id", "finish1")
    .attr("viewBox", `0 0 ${iconWidth} ${iconWidth}`)
    .style("fill", "inherit")
    .style("stroke", "transparent")
    .style("stroke-width", "2px")
    .attr("width", iconWidth-2)
    .attr("height", iconWidth-2)
    .attr("x", 2)
    .attr("y", 2)
    .attr("rx", 2);

    defs.append("rect")
    .attr("id", "skip1")
    .attr("viewBox", `0 0 ${iconWidth} ${iconWidth}`)
    .style("fill", "inherit")
    .style("stroke", "transparent")
    .style("stroke-width", "2px")
    .attr("width", iconWidth-2)
    .attr("height", iconWidth-2)
    .attr("x", 2)
    .attr("y", 2)
    .attr("rx", 2);
    
    defs.append("rect")
    .attr("id", "loop1")
    .attr("viewBox", `0 0 ${iconWidth} ${iconWidth}`)
    .style("fill", "inherit")
    .style("stroke", "transparent")
    .style("stroke-width", "2px")
    .attr("width", iconWidth-2)
    .attr("height", iconWidth-2)
    .attr("x", 2)
    .attr("y", 2)
    .attr("rx", 2);

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

let iconRegex = new RegExp("start|finish|loop|skip");
const isIconFn = function (n) {
  return (n && n.model && iconRegex.test(n.model.tagName));
};

function render(graph){
  // Clear and redraw
  let root = svg.selectAll(".root");
  // reset diagram
  root.remove();
  root = svg.append("g").attr("class", "root");

  console.log(JSON.stringify(graph,null,"  "));
  //console.log(elkgraph);

  const options = {
    "elk.algorithm": "layered",
    "nodePlacement.strategy": "BRANDES_KOEPF",
    "org.eclipse.elk.port.borderOffset": 4,
    "org.eclipse.elk.padding": 0,
    "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
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

    layouter.on("finish", function(node) {
      renderd3Layoutv2(root,node);
    });
  
    // start an initial layout
    layouter.kgraph(graph);
}

// Helper functions
const portsFn = function (n) {
  // by default the 'ports' field
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

function renderd3Layoutv2(svg,node){
  // Get current children nodes and links
  var nodes = nodesFn(node);
  var links = linksFn(node);

// Add edges
  if(links){
    var linkData = svg.append("g").attr("class", "edges").selectAll(".link").data(links, idFn);

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
      /*
      linkEnter.call(function(selection) { 
        let d = selection.datum();
        // extract class names from tagName
        if(d.model && d.model.tagName){
          selection.classed(d.model.provider,true);
          selection.classed(d.model.resourceType,true);
        }       
      });//*/
      linkEnter.each(function(d,i) { 
        // Update current selection attributes
        let selection = d3.select(this);
        // extract class names from tagName
        if(d.model){
          selection.classed(d.model.provider,true);
          selection.classed(d.model.resourceType,true);
        }       
      });
    }
// Add nodes
    if(nodes){
      var nodeData = svg.selectAll(".node").data(nodes, idFn);

      var nodeEnter = nodeData.enter()
        .append("g")
        .attr("class", function(d) { 
          let c = "node leaf";
          if (nodesFn(d).length > 0) {
            c = "node compound";
          } 
          return c;    
        }).each(function(d,i) { 
          // Update current selection attributes
          let selection = d3.select(this);
          // extract class names from tagName
          if(d.model){
            selection.classed(d.model.provider,true);
            selection.classed(d.model.resourceType,true);
            selection.classed(d.model.tagName,true);
          } 
          // Node type  
          if(isIconFn(d)){
            selection.append("use")
              .style("fill", "inherit")
              .style("stroke", "inherit")
              .attr("href",(data) =>{
                let suffix = data.model.tagName;
                //return "Cloud Functions.svg#Layer_1";
                return "#"+suffix+"1"; 
              })
              .attr("x", function(d) { return 0; })
              .attr("y", function(d) { return 0; })
              .attr("width", function(d) { return d.width; })
              .attr("height", function(d) { return d.height; });
          } else {
            selection.append("rect")
            .style("fill", "inherit")
            .style("stroke", "inherit")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .attr("rx", 8)
            .append("metadata")
            .text((d) => {
              return JSON.stringify(d.model,null," ");
            });
          }   
          // Labels
          // Create new selection from current one
          selection.selectAll(".label").data((d,i)=>{
            return labelsFn(d);
          }).enter()
            .append("text")
            .attr("class","label")
            .text((l) => l.text)
            .style("stroke-width",1)
            .style("font-size",12)
            .attr("x", (l) => l.x)
            .attr("y", (l) => l.y)
            .attr("width", (l) => l.width)
            .attr("height", (l) => l.height);
            // ports
             // Create new selection from current one
          selection.selectAll(".port").data((d,i)=>{
            return portsFn(d);
          }).enter()
            .append("rect")
            .attr("class","port")
            .attr("x", (l) => l.x)
            .attr("y", (l) => l.y)
            .attr("width", (l) => l.width)
            .attr("height", (l) => l.height);
        })
        .attr("transform", function(d) { 
          return "translate(" + (d.x || 0) + " " + (d.y || 0) + ")";
        }).attr("id", function(d) { 
          return idFn(d);
        });

        // Add title  
        nodeEnter.append("title")
            .text(function(d) { return d.id; });

        nodeEnter.each(function(n,i){
          // If node has children make a recursive call
          if(nodesFn(n).length > 0){
            renderd3Layoutv2(d3.select(this),n);
          }
        });    
    }
}

  return {
    render
  };
}
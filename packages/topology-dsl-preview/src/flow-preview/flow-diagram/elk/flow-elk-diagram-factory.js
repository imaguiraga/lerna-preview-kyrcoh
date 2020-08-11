import * as d3 from "d3";
//const ELK = require('elkjs');
import ELK from 'elkjs/lib/elk.bundled.js';
import './elk-style.css';

import {
  FlowUIDVisitor,
  FlowToELKVisitor,
  ELKDimensionVisitor
} from "../visitor/index.js";

const uidvisitor = new FlowUIDVisitor();
const elkvisitor = new FlowToELKVisitor();

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

let svg = init(containerElt,width,height,iconWidth);
/*
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
//*/
let iconRegex = new RegExp("start|finish|loop|skip");
const isIconFn = function (n) {
  return (n && n.model && iconRegex.test(n.model.tagName));
};

function toElkGraph(dslObject){
  let elkgraph = null;
  try {
    // Update preview
    dslObject = uidvisitor.visit(dslObject);
    // dslObject to elkgraph
    elkgraph = elkvisitor.toElkGraph(dslObject);
  } catch(e) {
    console.error(e);
  }
  return elkgraph;
}

function elkLayout(){
  const elkDimensionVisitor = new ELKDimensionVisitor();  
  const elk = new ELK();
  let options = {
    "elk.algorithm": "layered",
    "nodePlacement.strategy": "BRANDES_KOEPF",
    "org.eclipse.elk.port.borderOffset": 4,
    "org.eclipse.elk.padding": 16,
    "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
    "org.eclipse.elk.layered.mergeEdges":true,
    "org.eclipse.elk.zoomToFit":true,
    "spacing": 40,
    "spacing.nodeNodeBetweenLayers": 40,
    "spacing.edgeNodeBetweenLayers": 40,
    "spacing.edgeEdgeBetweenLayers": 40,
    "layering.strategy": "LONGEST_PATH"
  };

  function layoutFn(inelkgraph){
    // Add node width.height
    let elkgraph = elkDimensionVisitor.visit(inelkgraph);

    //console.log(JSON.stringify(elkgraph,null,"  "));
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

  layoutFn.nodeHeight = function(newSize) {	
    if (!arguments.length) return elkDimensionVisitor._nodeHeight;
    elkDimensionVisitor.nodeHeight(newSize);
    return this;
  };

  layoutFn.nodeWidth = function(newSize) {	
    if (!arguments.length) return elkDimensionVisitor._nodeWidth;
    elkDimensionVisitor.nodeWidth(newSize);
    return this;
  };

  layoutFn.nodeSize = function(width,height) {	
    if (!arguments.length) return [elkDimensionVisitor._nodeWidth,elkDimensionVisitor._nodeHeight];
  
    elkDimensionVisitor.nodeWidth(width);
    elkDimensionVisitor.nodeHeight(height||width);

    return this;
  };

  layoutFn.portSize = function(newSize) {	
    if (!arguments.length) return elkDimensionVisitor._portSize;
    elkDimensionVisitor.portSize(newSize);
    return this;
  };
  
  layoutFn.options = function(newOptions) {	
    if (!arguments.length) return options;
    options = newOptions;
    return this;
  };

  return layoutFn;
}

function render(dslObject){
  if(dslObject !== null){
    //console.log(JSON.stringify(dslObject,null,"  "));
  }

  let elkgraph = toElkGraph(dslObject);
 
  const layout = elkLayout();
  layout.nodeSize(80).portSize(8);

  function refreshFn() {
    layout(elkgraph).then((elkLayoutGraph) =>{
      // Clear and redraw
      let root = svg.selectAll("g.root");
      // reset diagram
      root.remove();
      root = svg.append("g").attr("class", "root");
      renderd3Layout(root,elkLayoutGraph,refreshFn);
  
    }).catch((e) => {
      console.log(e);
    });
  }

  refreshFn();
  
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


function renderd3Layout(svg,node,refreshFn){
  // Get current children nodes and links
  var nodes = nodesFn(node);
  var links = linksFn(node);

  // Toggle expansion on/off
  function collapseNode(d){
    d3.event.stopPropagation();

    // is expanded
    if(d.model.compound){
      // Remove children and edges 
      d._children = d.children;
      d.children = [];

      d._edges = d.edges;
      d.edges = null;
      d.model.compound = false;
      d.collapsed = true;
      
    } else if(d.collapsed){
      // Restore children and edges
      d.children = d._children;
      d._children = null;

      d.edges = d._edges;
      d._edges = null;
      d.model.compound = true;
      d.collapsed = false;
    }

    refreshFn();
    //*/
  }

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
          let c = "leaf";
          if (nodesFn(d).length > 0) {
            c = "compound";
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
            if(d.model.compound === true || d.collapsed){
              selection.on('click',collapseNode);
            }
          } 
          // Node type  
          if(isIconFn(d)){
            selection.append("use")
              .attr("class","node")
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
            .attr("class","node")
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
          // Ports
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
            renderd3Layout(d3.select(this),n,refreshFn);
          }
        });    
    }
  }

  return {
    render
  };
}

function init(containerElt,width,height,iconWidth){
  const zoomFn = d3.zoom().on("zoom", function () {
    //d3.select(d3.event.target).attr("transform", d3.event.transform);
    d3.select(this).select("g").attr("transform", d3.event.transform);
    //svg.attr("transform", d3.event.transform);
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
  return svg;
}
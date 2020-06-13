import "./style/styles.css";
// using ES6 modules
import Split from "split.js";
import {samples} from "./samples.js";
import {createEditor} from "./flow-editor";

import * as flowDsl from "../flow-dsl";
import * as diagram from "./flow-diagram";

const {parseDsl} = flowDsl;
const DEBUG = true;

document.body.innerHTML = `
<div id="grid">
		<div id="one" class="pane">
			<h6>Flow EDITOR</h6>
			<div style="margin:2px;font-size:12px">
				<select id="flow-sample-select" class="flow-select">
          <option value="-1">Select a sample</option>
        </select>
			</div>
			<div class="separator"></div>
			<div id="editor-pane" class="content-pane"></div>
		</div>
		<div id="two" class="pane">
			<h6>Flow PREVIEW</h6>
			<div style="margin:2px;font-size:12px">
				<select id="flow-preview-select" class="flow-select">
          <option value="-1">Select a flow</option>
        </select>
			</div>
			<div class="separator"></div>
			<div id="preview-pane" class="content-pane"></div>
		</div>
	</div>
`;

// Initialize Split Pane
Split(["#one", "#two"], {
  sizes: [40, 60],
  minSize: [200, 300],
  gutter: function(index, direction) {
    var gutter = document.createElement("div");
    gutter.className = "gutter gutter-" + direction;
    return gutter;
  },
  gutterSize: 2,
  elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    }),
    gutterStyle: (dimension, gutterSize) => ({
        'flex-basis':  `${gutterSize}px`,
    })
});

const {
  FlowToG6Visitor,
  FlowUIDVisitor,
  FlowToELKVisitor
} = diagram;

const visitor = new FlowToG6Visitor();
const uidvisitor = new FlowUIDVisitor();
const elkvisitor = new FlowToELKVisitor();

const graph = diagram.createFlowDiagram("preview-pane");

function updatePreviewPane(content){
  if( typeof content === "undefined"){
    return;
  }
  try {
    // Update preview
    let flows = parseDsl(content,flowDsl);
    renderFlow(flows.get(flows.keys().next().value)); 
    initFlowSelection(flows);   

  } catch(e) {
    console.error(e);
    graph.data([]);
    graph.render();
  }
}

function renderFlow(input){
  if( typeof input === "undefined"){
    return;
  }
  graph.data([]);
  try {
    // Update preview
    let flow = uidvisitor.visit(input);
    const data = visitor.visit(flow);
    graph.data(data!== null ? data : []);

    const elkgraph = elkvisitor.visit(flow);
    elkgraph.layoutOptions = {
      "elk.algorithm": "layered",
      "nodePlacement.strategy": "BRANDES_KOEPF",
      //"org.eclipse.elk.edgeRouting": "POLYLINE",
      "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
      "org.eclipse.elk.port.borderOffset": 10,
      "org.eclipse.elk.layered.mergeEdges": true,
      "spacing.nodeNodeBetweenLayers": 40,
      "spacing.edgeNodeBetweenLayers": 40,
      "spacing.edgeEdgeBetweenLayers": 40,
      "layering.strategy": "LONGEST_PATH"
    };

    elkgraph.children.forEach((n) => {
      n.width = 80;
      n.height = 60;
      if(n.model) {
        let tag = n.model.tagName || null;
        // Set start + finish to icon size
        if(tag === "start" || tag === "finish"){
          n.width = 24;
          n.height = n.width;
        }
      }     
    });

    console.log(JSON.stringify(elkgraph,null,"  "));
    console.log(elkgraph);

  } catch(e) {
    console.error(e);
  }
  graph.render();
  if(DEBUG) console.log("zoom="+graph.getZoom());
  
}

const editor = createEditor('editor-pane','');

editor.on("changes",(instance) => {
  if(DEBUG) console.log('changes');
  const content = instance.getDoc().getValue();
  updatePreviewPane(content);
}); 

function initFlowSelection(flows){
  // Populate select component from list of samples
  let selectElt = document.getElementById("flow-preview-select");
  // Recreate flow options
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  flows.forEach((value,key) => {
    let opt = document.createElement("option");
    opt.value = key;
    opt.text = key;
    selectElt.add(opt);
  });
  // Update flow when the selection changes 
  selectElt.addEventListener('change', (event) => {
    const result = flows.get(event.target.value);
    renderFlow(result);
  });
}


(function initSampleSelection(samples,editor){
  // Populate select component from list of samples
  let selectElt = document.getElementById("flow-sample-select");

  // Recreate sample options
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  samples.forEach((value,index) => {
    let opt = document.createElement("option");
    opt.value = index;
    opt.text = `Sample #${index +1}`;
    selectElt.add(opt);
  });
  // Update sample when the selection changes 
  selectElt.addEventListener('change', (event) => {
    const result = samples[event.target.value];
    editor.getDoc().setValue(result);
    updatePreviewPane(result);
  });
  
  editor.getDoc().setValue(samples[0]);
  
})(samples,editor);
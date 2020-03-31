import "../styles.css";
// using ES6 modules
import Split from "split.js";
import {samples} from "../samples.js";
import {createEditor} from "../pipeline-editor";

import * as pipeline from "../pipeline-dsl";
import * as diagram from "../pipeline-diagram";

const {parseDsl} = pipeline;
const DEBUG = true;

document.body.innerHTML = `
<div id="grid">
		<div id="one" class="pane">
			<h6>Pipeline EDITOR</h6>
			<div style="margin:2px;font-size:12px">
				<select id="pipeline-sample-select" class="pipeline-select">
          <option value="-1">Select a sample</option>
        </select>
			</div>
			<div class="separator"></div>
			<div id="editor-pane" class="content-pane"></div>
		</div>
		<div id="two" class="pane">
			<h6>Pipeline PREVIEW</h6>
			<div style="margin:2px;font-size:12px">
				<select id="pipeline-preview-select" class="pipeline-select">
          <option value="-1">Select a pipeline</option>
        </select>
			</div>
			<div class="separator"></div>
			<div id="preview-pane" class="content-pane"></div>
		</div>
	</div>
`;

// Initialize Split Pane
const splitPane = Split(["#one", "#two"], {
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
  PipelineToG6Visitor,
  PipelineUIDVisitor
} = pipeline;

const visitor = new PipelineToG6Visitor();
const uidvisitor = new PipelineUIDVisitor();

const graph = diagram.createPipelineDiagram("preview-pane");

function updatePreviewPane(content){
  if( typeof content === "undefined"){
    return;
  }
  try {
    // Update preview
    let pipelines = parseDsl(content,pipeline);
    renderPipeline(pipelines.get(pipelines.keys().next().value)); 
    initPipelineSelection(pipelines);   

  } catch(e) {
    console.error(e.name + ': ' + e.message);
    graph.data([]);
    graph.render();
  }
}

function renderPipeline(input){
  if( typeof input === "undefined"){
    return;
  }
  graph.data([]);
  try {
    // Update preview
    let pipeline = uidvisitor.visit(input);
    const data = visitor.visit(pipeline);
    graph.data(data!== null ? data : []);

  } catch(e) {
    console.error(e.name + ': ' + e.message);
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

function initPipelineSelection(pipelines){
  // Populate select component from list of samples
  let selectElt = document.getElementById("pipeline-preview-select");
  // Recreate pipeline options
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  pipelines.forEach((value,key) => {
    let opt = document.createElement("option");
    opt.value = key;
    opt.text = key;
    selectElt.add(opt);
  });
  // Update pipeline when the selection changes 
  selectElt.addEventListener('change', (event) => {
    const result = pipelines.get(event.target.value);
    renderPipeline(result);
  });
}


(function initSampleSelection(samples,editor){
  // Populate select component from list of samples
  let selectElt = document.getElementById("pipeline-sample-select");

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
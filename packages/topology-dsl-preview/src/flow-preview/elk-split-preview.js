import "./style/styles.css";
// using ES6 modules
import Split from "split.js";
import {samples} from "./samples.js";
import {createEditor} from "./flow-editor";

import * as flowDsl from "@imaguiraga/topology-dsl-core";
import * as diagram from "./flow-diagram";

const {
  parseDsl,
  resolveImports,
  NODEIDGENFN
} = flowDsl;
const DEBUG = true;

document.body.innerHTML = 
`<div id="grid">
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
  </div>`
  ;

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

const renderer = diagram.createElkRenderer("preview-pane");

// load the data and render the elements
fetch("pipeline.json").then( function(response) { 
  console.log(response);
  //renderer.render(response);   
});

// Reset ids
function resetIds(obj,idx) {
  if(obj.id){
    // Append a suffix
    obj.id = obj.id+"_"+idx;

    if(obj._start !== null){
      obj._start.id = obj._start.id+"_"+idx;
    }
    if(obj._finish !== null){
      obj._finish.id = obj._finish.id+"_"+idx;
    }
  }
  return obj;
}

// Clone and reset ids
function clone(obj,idx) {
  if(obj === undefined || obj === null){
    return obj;
  }
  let copy = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  // Deep copy
  if(copy.compound) {
    if(Array.isArray(copy.elts)){
      copy.elts = copy.elts.map((elt) => {
        return clone(elt,idx);
      });
    }
  }

  if(copy._start !== null){
    copy._start = clone(copy._start,idx);
  }
  if(copy._finish !== null){
    copy._finish = clone(copy._finish,idx);
  }

  return resetIds(copy,idx);
}

function updatePreviewPane(content){
  // Reset node ids
  if( typeof content === "undefined" || content === null){
    return;
  }
  try {
    // Update preview
    resolveImports(content).then((loadedImports) => {
      NODEIDGENFN.next(true);
      // Inject load function
      flowDsl.load = (key) => {
        let obj = loadedImports.get(key);
        //Clone to avoid ids collision
        let copy = clone(obj,NODEIDGENFN.next().value);
        return copy;
      };

      let flows = parseDsl(content,flowDsl);
      renderFlow(flows.get(flows.keys().next().value)); 
      initFlowSelection(flows);   

    }).catch((error) => {
      console.error('Error:', error);
    });
    
  } catch(e) {
    console.error(e);
  }
}

function renderFlow(input){
  if( typeof input === "undefined" || input === null){
    return;
  }

  try {
    renderer.render(input);
 
  } catch(e) {
    console.error(e);
  }
 
}

const editor = createEditor('editor-pane','');

editor.on("changes",(instance) => {
  if(DEBUG) console.log('changes');
  const content = instance.getDoc().getValue();
  updatePreviewPane(content);
}); 

let selectEltChangeHandler = null;
function initFlowSelection(flows){
  NODEIDGENFN.next(true);
  // Populate select component from list of samples
  let selectElt = document.getElementById("flow-preview-select");
  // Detach selection handler
  if(selectEltChangeHandler != null) {
    selectElt.removeEventListener('change', selectEltChangeHandler);
  }

  selectEltChangeHandler = (event) => {
    const result = flows.get(event.target.value);
    renderFlow(result);
  };
  
  // Recreate flow options
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  flows.forEach((value,key) => {
    let opt = new Option(key,key);
    selectElt.add(opt);
  });
  // Attach selection handler 
  selectElt.addEventListener('change', selectEltChangeHandler);

}

(function initSampleSelection(samples,editor){
  // Populate select component from list of samples
  let selectElt = document.getElementById("flow-sample-select");

  // Recreate sample options
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  samples.forEach((value,index) => {
    let opt = new Option(`Sample #${index +1}`,index);
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
import './style/styles.css';
// using ES6 modules
import Split from 'split.js';
import { samples } from './samples1.js';
import { createEditor } from './editor';
import * as diagram from './diagram';

import * as flowDsl from '@imaguiraga/topology-dsl-core';

const {
  parseDsl, parseDslModule,
  resolveImports,
  NODEIDGENFN,
  clone
} = flowDsl;

const DEBUG = true;

function loadFnFactory() {
  let loadedImports = new Map();
  const loadFn = (key) => {
    if (loadedImports.has(key)) {
      let obj = loadedImports.get(key);
      //Clone to avoid ids collision
      let copy = clone(obj, NODEIDGENFN.next().value);
      return copy;
    } else {
      return null;
    }
  };

  loadFn.loadedImports = function (newValue) {
    if (!arguments.length) return loadedImports;
    loadedImports = newValue;
    return this;
  };

  return loadFn;
}

flowDsl.load = loadFnFactory();

document.body.innerHTML =
  `<div id='grid'>
		<div id='one' class='pane'>
			<h6>Topology EDITOR</h6>
			<div style='margin:2px;font-size:12px'>
				<select id='flow-sample-select' class='flow-select'>
          <option value='-1'>Select a sample</option>
        </select>
			</div>
			<div class='separator'></div>
			<div id='editor-pane' class='content-pane'></div>
		</div>
		<div id='two' class='pane'>
			<h6>Topology PREVIEW</h6>
			<div style='margin:2px;font-size:12px'>
				<select id='flow-preview-select' class='flow-select'>
          <option value='-1'>Select a flow</option>
        </select>
			</div>
			<div class='separator'></div>
			<div id='preview-pane' class='content-pane'></div>
		</div>
  </div>`
  ;

// Initialize Split Pane
Split(['#one', '#two'], {
  sizes: [40, 60],
  minSize: [200, 300],
  gutter: function (index, direction) {
    var gutter = document.createElement('div');
    gutter.className = 'gutter gutter-' + direction;
    return gutter;
  },
  gutterSize: 2,
  elementStyle: (dimension, size, gutterSize) => ({
    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
  }),
  gutterStyle: (dimension, gutterSize) => ({
    'flex-basis': `${gutterSize}px`,
  })
});

const renderer = diagram.createElkRenderer('preview-pane');

function updatePreviewPane(content) {
  // Reset node ids
  if (typeof content === 'undefined' || content === null) {
    return;
  }
  try {
    // Update preview
    resolveImports(content).then((resolvedImports) => {
      NODEIDGENFN.next(true);
      // Inject load function
      flowDsl.load.loadedImports(resolvedImports);

      parseDsl(content, flowDsl).then((flows) => {
        // Update graph flows
        renderFlow(flows.get(flows.keys().next().value));
        initFlowSelection(flows);
      });

    }).catch((error) => {
      console.error('Error:', error);
    });

  } catch (e) {
    console.error(e);
  }
}

function renderFlow(input) {
  if (typeof input === 'undefined' || input === null) {
    return;
  }

  try {
    renderer.render(input);

  } catch (e) {
    console.error(e);
  }

}

const editor = createEditor('editor-pane', '');

editor.on('changes', (instance) => {
  if (DEBUG) console.log('changes');
  const content = instance.getDoc().getValue();
  updatePreviewPane(content);
});

let selectEltChangeHandler = null;
function initFlowSelection(flows) {
  NODEIDGENFN.next(true);
  // Populate select component from list of samples
  let selectElt = document.getElementById('flow-preview-select');
  // Detach selection handler
  if (selectEltChangeHandler != null) {
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

  flows.forEach((value, key) => {
    let opt = new Option(key, key);
    selectElt.add(opt);
  });
  // Attach selection handler 
  selectElt.addEventListener('change', selectEltChangeHandler);

}

(function initSampleSelection(samples, editor) {
  // Populate select component from list of samples
  let selectElt = document.getElementById('flow-sample-select');

  // Recreate sample options
  while (selectElt.firstChild) {
    selectElt.firstChild.remove();
  }

  samples.forEach((value, index) => {
    let opt = new Option(`Sample #${index + 1}`, index);
    selectElt.add(opt);
  });
  // Update sample when the selection changes 
  selectElt.addEventListener('change', (event) => {
    const result = samples[event.target.value];
    editor.getDoc().setValue(result);
    updatePreviewPane(result);
  });

  editor.getDoc().setValue(samples[0]);

})(samples, editor);
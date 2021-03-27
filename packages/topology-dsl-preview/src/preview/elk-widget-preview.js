// text -> dslObject -> [elkGraph] => [elkGraph] -> elkLayout -> elkLayoutRelative -> elkLayoutAbsolute -> x6Layout -> x6Graph
/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  CommandRegistry
} from '@lumino/commands';

import {
  BoxPanel, DockPanel, Widget
} from '@lumino/widgets';

import {
  createMenu, createBarWidget, createPalette
} from './widgets/menu-util';

import { CodeMirrorWidget } from './widgets/codemirror-widget';
import { AceEditorWidget } from './widgets/ace-editor-widget';

import { ELKGraphWidget } from './widgets/elkgraph-widget';

import './style/widget-style.css';
import { samples } from './samples-1.js';
import { samples2 } from './samples-2.js';

import * as flowDsl1 from '@imaguiraga/topology-dsl-core';
import * as azure from '../assets/js/Azure_Products_Icons';
import * as gcp from '../assets/js/GCP_Icons';
import { toElkGraph } from './diagram';
const {
  parseDsl,
  parseDslModule,
  debugOn,
  registerJSModule,
  resolveImports,
  NODEIDGENFN,
  clone
} = flowDsl1;

const flowDsl = { ...flowDsl1 };
registerJSModule('azure-dsl', azure);
registerJSModule('gcp-dsl', gcp);

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

function main() {
  const commands = new CommandRegistry();
  createMenu(commands);
  let bar = createBarWidget(commands);
  let palette = createPalette(commands);
  let main = createMainWidget(palette, commands);

  Widget.attach(bar, document.body);
  Widget.attach(main, document.body);
  //*/
}

function createMainWidget(palette, commands) {
  const elkgraphWidget = new ELKGraphWidget(640, 640);

  const editorWidget = new CodeMirrorWidget({
    mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
  });
  //*/

  // const editorWidget = new AceEditorWidget();
  editorWidget.title.label = 'EDITOR';

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) {
      return;
    }
    if (event.data.jsonrpc !== undefined) {
      console.log('event => ' + event.data.method);
      if (event.data.method === 'update.flows') {
        // Convert entries array to map
        elkgraphWidget.flows = event.data.params;
      }
    }

  }, false);

  const callbackFn = function (content) {
    try {
      // TODO NODEIDGENFN.next(true);         
      parseDslModule(content, flowDsl).then((flows) => {
        // Update graph flows
        if (flows !== undefined && flows !== null) {
          const result = new Map();
          flows.forEach((dslObject, key, map) => {
            if (dslObject !== null) {
              //console.log(JSON.stringify(dslObject,null,'  '));
              const elkgraph = toElkGraph(dslObject);
              result.set(key, elkgraph);
            }

          });

          console.log('parseDslModule');
          // Convert to array
          const message = { jsonrpc: '2.0', method: 'update.flows', params: result };
          // Update flows
          window.postMessage(message, window.location.origin);
        }
      }).catch((err) => {
        console.log(err);
        let variables = new Map();
        variables.set('ERROR', err.message);
        const message = { jsonrpc: '2.0', method: 'update.flows', params: variables };
        // Update flows
        window.postMessage(message, window.location.origin);
      });

    } catch (e) {
      console.error(e.name + ': ' + e.message);
    }
  };

  editorWidget.valueChanged.connect(
    (sender, value) => {
      console.log('valueChanged');
      callbackFn(value);
    }
  );

  // set default samples
  editorWidget.samples = samples2;
  editorWidget.selectElt.addEventListener('change', (event) => {
    // TODO NODEIDGENFN.next(true);
  });

  let dock = new DockPanel();

  dock.addWidget(editorWidget);
  dock.addWidget(elkgraphWidget, { mode: 'split-right', ref: editorWidget });

  dock.id = 'dock';

  let savedLayouts = [];

  commands.addCommand('save-dock-layout', {
    label: 'Save Layout',
    caption: 'Save the current dock layout',
    execute: () => {
      savedLayouts.push(dock.saveLayout());
      palette.addItem({
        command: 'restore-dock-layout',
        category: 'Dock Layout',
        args: { index: savedLayouts.length - 1 }
      });
    }
  });

  commands.addCommand('restore-dock-layout', {
    label: (args) => {
      return `Restore Layout ${args.index}`;
    },
    execute: (args) => {
      dock.restoreLayout(savedLayouts[args.index]);
    }
  });

  palette.addItem({
    command: 'save-dock-layout',
    category: 'Dock Layout',
    rank: 0
  });

  BoxPanel.setStretch(dock, 1);

  let main = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
  main.id = 'main';

  main.addWidget(dock);
  window.onresize = () => { main.update(); };
  return main;
}

window.onload = main;

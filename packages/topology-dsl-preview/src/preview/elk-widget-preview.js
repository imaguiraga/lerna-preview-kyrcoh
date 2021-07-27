// text -> dslObjectMap -> dslObject -> [elkGraph] => [elkGraph] -> elkLayout -> elkLayoutRelative -> elkLayoutAbsolute -> x6Layout -> x6Graph
/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  parseJSSourceModule,
  registerJSModule
} from './module-util';

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
//import { AceEditorWidget } from './widgets/ace-editor-widget';

import { IframeELKGraphWidget } from './widgets/iframe-elkgraph-widget';

import './style/widget-style.css';
import { samples } from './samples-1.js';
import { samples2 } from './samples-2.js';

import * as flowDsl from '@imaguiraga/topology-dsl-core';
import * as gcp from '../assets/js/GCP';
import { toElkGraph } from './diagram';
const {
  NODEIDGENFN,
  clone
} = flowDsl;

//const DSL_MODULE = { ...flowDsl };
registerJSModule('gcp-dsl', gcp);

// Dynamically register compiled modules
registerJSModule('topology-dsl', flowDsl);
registerJSModule('@imaguiraga/topology-dsl-core', flowDsl);
registerJSModule('core-dsl', flowDsl);

/*
System.set('app://topology-dsl', flowDsl);
System.set('app://@imaguiraga/topology-dsl-core', flowDsl);
System.set('app://core-dsl', flowDsl);
// */

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


function extractVariables(modules) {
  // Convert exports to map

  let variables = new Map();
  if (modules !== null) {
    // Convert resolved export keys to a map
    for (let key in modules) {
      // Exclude module specific properties
      if (key !== 'default' && !key.startsWith('_')) {
        // Extract only subclasses of ResourceElt
        if (modules[key] instanceof flowDsl.ResourceElt) {
          variables.set(key, modules[key]);
        }
      }
    }
  }
  return variables;
}

function createMainWidget(palette, commands) {
  const elkgraphWidget = new IframeELKGraphWidget('x6-renderer/index.html');

  const editorWidget = new CodeMirrorWidget({
    mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
  });
  //*/

  // const editorWidget = new AceEditorWidget();
  editorWidget.title.label = 'EDITOR';

  const messageCallbackFn = function (event) {
    if (event.data.jsonrpc !== undefined) {
      console.log('event => ' + event.data.method);
      if (event.data.method === 'update.flows') {
        // Convert entries array to map
        elkgraphWidget.flows = event.data.params;
      }
    }
  };

  const callbackFn = function (content) {
    const IMPORT_ID = location.href + 'IMPORT.js';
    try {
      // TODO NODEIDGENFN.next(true);         
      parseJSSourceModule(IMPORT_ID, content).then((modules) => {
        let dslObjectMap = extractVariables(modules);
        // Update graph flows
        if (dslObjectMap !== undefined && dslObjectMap !== null) {
          const result = new Map();
          dslObjectMap.forEach((dslObject, key, map) => {
            if (dslObject !== null) {
              //console.log(JSON.stringify(dslObject,null,'  '));
              const elkgraph = toElkGraph(dslObject);
              result.set(key, elkgraph);
            }

          });

          console.log('parseJSSourceModule');
          // Convert to array
          const message = { jsonrpc: '2.0', method: 'update.flows', params: result };
          // Update flows
          messageCallbackFn({ data: message });
        }
      }).catch((err) => {
        console.log(err);
        let variables = new Map();
        variables.set('ERROR', err.message);
        const message = { jsonrpc: '2.0', method: 'update.flows', params: variables };
        // Update flows
        messageCallbackFn({ data: message });
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

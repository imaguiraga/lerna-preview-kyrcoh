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

import './style/widget-style.scss';
import { samples } from './samples-1.js';
import { samples2 } from './samples-2.js';

import * as dslmodule from '@imaguiraga/topology-dsl-core';
import * as gcpmodule from '../assets/js/GCP';
import * as awsmodule from '../assets/js/AWS';
import { toElkGraph } from './diagram';

registerJSModule('gcp-dsl', gcpmodule);
registerJSModule('aws-dsl', awsmodule);

// Dynamically register compiled modules
registerJSModule('topology-dsl', dslmodule);
registerJSModule('@imaguiraga/topology-dsl-core', dslmodule);
registerJSModule('core-dsl', dslmodule);

/*
System.set('app://topology-dsl', dslmodule);
System.set('app://@imaguiraga/topology-dsl-core', dslmodule);
System.set('app://core-dsl', dslmodule);
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
        // Extract only subclasses of BaseElt
        if (modules[key] instanceof dslmodule.BaseElt) {
          variables.set(key, modules[key]);
        }
      }
    }
  }
  return variables;
}

function createMainWidget(palette, commands) {

  const src = 'x6-renderer/index.html';
  //const src = 'http://localhost:5000';
  const elkgraphWidget = new IframeELKGraphWidget(null);

  elkgraphWidget.src = src;

  const editorWidget = new CodeMirrorWidget();
  //const editorWidget = new AceEditorWidget();
  editorWidget.title.label = 'EDITOR';
  editorWidget.samples = samples2;

  const messageCallbackFn = function (message) {
    if (message.jsonrpc !== undefined) {
      elkgraphWidget.updateView(message);
    }
  };

  const valueChangedCallbackFn = function (value) {
    const IMPORT_ID = location.href + 'IMPORT.js';
    try {
      // TODO NODEIDGENFN.next(true);         
      parseJSSourceModule(IMPORT_ID, value.content).then((modules) => {
        console.log('parseJSSourceModule');
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

          // Convert to array
          const message = { jsonrpc: '2.0', method: 'view.update', params: { key: value.key, values: result } };
          // Update flows
          messageCallbackFn(message);
        }
      }).catch((err) => {
        console.log(err);
        const message = { jsonrpc: '2.0', method: 'view.error', params: err.message };
        // Update flows
        messageCallbackFn(message);
      });

    } catch (e) {
      console.error(e.name + ': ' + e.message);
    }
  };

  editorWidget.valueChanged.connect((sender, value) => {
    console.log('valueChanged');
    valueChangedCallbackFn(value);
  });

  elkgraphWidget.onload.connect((sender, value) => {
    // Set default samples
    console.log('onload');
    editorWidget.updateEditorContent(null);
  });

  const dock = new DockPanel();

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

  const mainPanel = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
  mainPanel.id = 'main';

  mainPanel.addWidget(dock);
  window.onresize = () => { mainPanel.update(); };
  return mainPanel;
}

window.onload = main;

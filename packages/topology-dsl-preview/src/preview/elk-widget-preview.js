// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
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

import { CodeMirrorWidget } from "./widgets/codemirror-widget";
import { AceEditorWidget } from "./widgets/ace-editor-widget";

import { ELKGraphWidget } from "./widgets/elkgraph-widget";

import './style/index.css';
import {samples} from "./samples.js";

import * as flowDsl from "@imaguiraga/topology-dsl-core";

const {
  parseDsl,
  resolveImports,
  NODEIDGENFN,
  clone
} = flowDsl;

function loadFnFactory() {
  let loadedImports = new Map();
  const loadFn = (key) => {
    if(loadedImports.has(key)) {
      let obj = loadedImports.get(key);
      //Clone to avoid ids collision     
      let copy = clone(obj,NODEIDGENFN.next().value);
      return copy;
    } else {
      return null;
    }
  };

  loadFn.loadedImports = function(newValue) {	
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
  let main = createMainWidget(palette,commands);

  Widget.attach(bar, document.body);
  Widget.attach(main, document.body);

}

function createMainWidget(palette,commands){
  const elkgraphWidget = new ELKGraphWidget(640,640);
/*
  const editorWidget = new CodeMirrorWidget({
    mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
  });
//*/

  const editorWidget = new AceEditorWidget();
//*/  
  editorWidget.title.label = 'Topology EDITOR';
  
  const callbackFn = function (content) {
    try {
      // Update preview
      resolveImports(content).then((resolvedImports) => {
        NODEIDGENFN.next(true);
        // Inject load function
        flowDsl.load.loadedImports(resolvedImports);
        
        let flows = parseDsl(content,flowDsl);
        // Update graph flows
        elkgraphWidget.flows = flows;
  
      }).catch((error) => {
        console.error('Error:', error);
      });

    } catch(e) {
      console.error(e.name + ': ' + e.message);
    }
  };

  editorWidget.valueChanged.connect(
    (sender, value) => {
      console.log("valueChanged");
      callbackFn(value);
    }
  );
  
  // set default samples
  editorWidget.samples = samples;

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

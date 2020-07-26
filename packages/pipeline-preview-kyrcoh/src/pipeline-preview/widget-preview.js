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
import { G6GraphWidget } from "./widgets/g6graph-widget";

import './style/index.css';
import {samples} from "./samples.js";

import * as pipelineDsl from "@imaguiraga/topology-dsl-core";
import * as diagram from "./pipeline-diagram";

const {
  parseDsl
} = pipelineDsl;

const {
  PipelineToG6Visitor,
  PipelineUIDVisitor,
  PipelineToELKVisitor,
} = diagram;

const visitor = new PipelineToG6Visitor();
const uidvisitor = new PipelineUIDVisitor();
const elkvisitor = new PipelineToELKVisitor();

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
  const g6graph = new G6GraphWidget(640,640);

  const cmSource = new CodeMirrorWidget({
    mode: 'text/typescript',
    lineNumbers: true,
    tabSize: 2,
  });
  
  cmSource.title.label = 'Pipeline EDITOR';
  
  cmSource.editor.on("changes",(instance) => {
    //if(DEBUG) 
    console.log('changes');
    try {
      // Update preview
      let content = instance.getDoc().getValue();
      let pipelines = parseDsl(content,pipelineDsl);

      // Convert pipelines to node data
      for (let key of pipelines.keys()) {
        let pipeline = uidvisitor.visit(pipelines.get(key));
        let value = visitor.visit(pipeline);
        pipelines.set(key,value);
        console.log(key);
      }
      // Update graph pipelines
      g6graph.pipelines = pipelines;

    } catch(e) {
      console.error(e.name + ': ' + e.message);
    }

  }); 
//*/

  cmSource.valueChanged.connect(
    (sender, value) => {
      console.log("valueChanged");
      /*
        try {
            // Update preview
            let pipelinefunc = parseDsl(value);
            let pipelines = pipelinefunc(pipeline);
            // Convert pipelines to node data
            for (let key of pipelines.keys()) {
            let pipeline = uidvisitor.visit(pipelines.get(key));
            let value = visitor.visit(pipeline);
            pipelines.set(key,value);
            console.log(key)
            }
            // Update graph pipelines
            g6graph.pipelines = pipelines;

        } catch(e) {
            console.error(e.name + ': ' + e.message);
        }
     //*/   
    }
  );
  
  // set default samples
  cmSource.samples = samples;

  let dock = new DockPanel();

  dock.addWidget(cmSource);
  dock.addWidget(g6graph, { mode: 'split-right', ref: cmSource });

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

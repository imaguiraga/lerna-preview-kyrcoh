/*******************************************************************************
 * Copyright (c) 2017 TypeFox GmbH (http://www.typefox.io) and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
import 'reflect-metadata';

import { TYPES, LocalModelSource } from 'sprotty';
import { getParameters, setupModelLink } from "../url-parameters";
import createContainer from '../sprotty-config';
import { ElkGraphJsonToSprotty } from './elkgraph-to-sprotty';

import JSON5 = require('json5');
import LZString = require('lz-string');

require('./elk-json-language');

const loading = document.getElementById('loading-sprotty')!;
const urlParameters = getParameters();

let initialContent: string;
if (urlParameters.compressedContent !== undefined) {
    initialContent = LZString.decompressFromEncodedURIComponent(urlParameters.compressedContent);
} else if (urlParameters.initialContent !== undefined) {
    initialContent = decodeURIComponent(urlParameters.initialContent);
} else {
    initialContent = `{
  id: "root",
  layoutOptions: { 'algorithm': 'layered' },
  children: [
    { id: "n1", width: 30, height: 30 },
    { id: "n2", width: 30, height: 30 },
    { id: "n3", width: 30, height: 30 }
  ],
  edges: [
    { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
    { id: "e2", sources: [ "n1" ], targets: [ "n3" ] }
  ]
}`;
}

// Create Monaco editor
monaco.languages.register({
    id: 'json',
    extensions: ['.json'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});
const editor = monaco.editor.create(document.getElementById('monaco-editor')!, {
    model: monaco.editor.createModel(initialContent, 'json', monaco.Uri.parse('inmemory:/model.json'))
});
editor.updateOptions({
    minimap: { enabled: false }
});
// Resize the monaco editor upon window resize.
// There's also an option 'automaticLayout: true' that could be passed to above 'create' method,
// however, this cyclically checks the current state and thus is less performant. 
window.onresize = () => editor.layout();

// Create Sprotty viewer
const sprottyContainer = createContainer();
sprottyContainer.bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
const modelSource = sprottyContainer.get<LocalModelSource>(TYPES.ModelSource);

const versionSelect = <HTMLSelectElement>document.getElementById('elk-version');

// Prepare multiple elks to be loaded lazily
let elks = {}
// Set up ELK
function retrieveElk(version) {
    if (elks[version] !== undefined) {
        return Promise.resolve(elks[version]);
    }
    return import(/* webpackChunkName: "[request]" */ '../../node_modules/elkjs-' + version + '/lib/elk-api')
        .then(ELK => {
            elks[version] = new ELK.default({
                workerUrl: './elk-' + version + '/elk-worker.min.js'
            });
            return elks[version];
        });
}

// Register listener
editor.getModel().onDidChangeContent(e => updateModel());
versionSelect.onchange = e => updateModel();

// Initial layout
updateModel();

setupModelLink(editor, (event) => {
    return {
        compressedContent: LZString.compressToEncodedURIComponent(editor.getValue())
    }
});

function updateModel() {
    try {
        //@TODO convert DSL JS to elkJSON
        let json = JSON5.parse(editor.getValue());
        monaco.editor.setModelMarkers(editor.getModel(), "", []);

        // Prepare the elk version selected by the user
        let selectedVersion = versionSelect.options[versionSelect.selectedIndex].value;
        loading.style.display = 'block';
        retrieveElk(selectedVersion).then(elk => {
            elk.layout(json)
                .then(g => {
                    let sGraph = new ElkGraphJsonToSprotty().transform(g);
                    modelSource.updateModel(sGraph)
                })
                .catch(e => {
                    let markers = [ errorToMarker(e) ]
                    monaco.editor.setModelMarkers(editor.getModel(), "", markers)
                })
                .finally(() => loading.style.display = 'none');
        });

    } catch (e) {
        let markers = [ errorToMarker(e) ];
        monaco.editor.setModelMarkers(editor.getModel(), "", markers);
        loading.style.display = 'none';
     }
}

function errorToMarker(e: any): monaco.editor.IMarkerData {
    return <monaco.editor.IMarkerData> {
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: e.lineNumber || 0,
        startColumn: e.columnNumber || 0,
        message: e.message
    };
}

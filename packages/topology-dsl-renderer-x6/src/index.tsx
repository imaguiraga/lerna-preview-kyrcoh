import './index.css';
import reportWebVitals from './reportWebVitals';

import 'es6-promise/auto';  // polyfill Promise on IE

import * as diagram from './preview/diagram';

import { sample } from './sample.js';

const contentPane = document.getElementById('root');
const selectElt: HTMLSelectElement = (document.getElementById('select') as HTMLSelectElement);
const minimapContainer = document.getElementById('mini-map');
minimapContainer?.setAttribute('class', 'minimap-container');

const renderer = diagram.createElkX6Renderer(contentPane, minimapContainer);

function resizeWindow() {

  renderer.graph.resize(
    window.document.documentElement.clientWidth,
    window.document.documentElement.clientHeight - selectElt.offsetHeight
  );

  renderer.graph.centerContent();
  renderer.graph.zoomToFit({ padding: 8 });
  console.log('onresize');
}

let listener: any = null;
function updateSelection(values: any) {
  // Populate select component from list of samples
  // Recreate flow options
  while (selectElt?.firstChild) {
    selectElt.firstChild.remove();
  }

  values.forEach((value: any, key: any) => {
    let opt = document.createElement('option');
    opt.value = key;
    opt.text = key;
    selectElt?.add(opt);
  });

  if (listener != null) {
    selectElt?.removeEventListener('change', listener);
    listener = null;
  }

  // Display flow
  // Update flow when the selection changes 
  if (listener == null) {
    listener = (event: Event) => {
      const result = values.get((event.target as any).value);
      renderer.render(result);
    };
    selectElt?.addEventListener('change', listener);
  }
  selectElt.options[0].selected = true;
  selectElt.value = selectElt.options[0].value;
  selectElt.dispatchEvent(new Event('change'));

}

const messageCallbackFn = function (event: any) {
  if (event.data.jsonrpc !== undefined) {
    console.log('event => ' + event.data.method);
    if (event.data.method === 'view.update') {
      // Convert entries array to map
      renderer.render(event.data.params);
    } else if (event.data.method === 'selection.update') {
      // Convert entries array to map
      updateSelection(event.data.params);
    }
  }
};

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) {
    return;
  }
  console.log('=> Window.onmessage' + event);
  messageCallbackFn(event);

}, false);


window.addEventListener('resize', resizeWindow);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
renderer.render(sample);


import './index.css';
import reportWebVitals from './reportWebVitals';

import 'es6-promise/auto';  // polyfill Promise on IE

import * as diagram from './preview/diagram';

import { sample } from './sample.js';

const contentPane = document.getElementById('root');
const minimapContainer = document.getElementById('mini-map');
minimapContainer?.setAttribute('class', 'minimap-container');

const renderer = diagram.createElkX6Renderer(contentPane, minimapContainer);

function resizeWindow() {
  renderer.graph.resize(window.document.documentElement.clientWidth, window.document.documentElement.clientHeight);
  renderer.graph.centerContent();
  renderer.graph.zoomToFit({ padding: 8 });
  console.log('onresize');
}

const messageCallbackFn = function (event: any) {
  if (event.data.jsonrpc !== undefined) {
    console.log('event => ' + event.data.method);
    if (event.data.method === 'update.view') {
      // Convert entries array to map
      renderer.render(event.data.params);
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

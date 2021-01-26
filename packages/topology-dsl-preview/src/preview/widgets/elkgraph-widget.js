/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Widget
} from '@lumino/widgets';

import * as diagram from "../diagram";

export class ELKGraphWidget extends Widget {

  constructor(_width, _height) {
    super();
    this._flows = new Map();
    this.addClass('CodeMirrorWidget');
    this.title.label = "PREVIEW";
    this.title.closable = false;
    this.title.caption = `Long description for ELK Graph`;

    let div = document.createElement('div');
    div.setAttribute("style", "padding:4px;background-color: #dfdfdf;");
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute("class", "flow-select");
    div.appendChild(this.selectElt);

    let opt = document.createElement('option');
    opt.value = "Option 1";
    opt.text = "Option 1";
    this.selectElt.add(opt);

    let separator = document.createElement('div');
    separator.setAttribute("class", "separator");
    this.node.appendChild(separator);

    this.contentPane = this.createVisibleContentPane();
    this.node.appendChild(this.contentPane);

    this.errorPane = this.createVisibleContentPane(false);
    this.errorPane.style.padding = '10px';
    this.errorPane.style.fontSize = '2em';
    this.node.appendChild(this.errorPane);

    this.renderer = diagram.createElkRenderer(this.contentPane, _width, _height);
    
    console.log(`ctor : W${this.contentPane.scrollWidth} - H${this.contentPane.scrollHeight}`);
  }

  createVisibleContentPane(visible = true) {
    const content = document.createElement('div');
    content.setAttribute("class", "content-pane");
    content.setAttribute("style", "scroll-behavior: auto; overflow: scroll;");
    content.style.display = visible ? 'block' : 'none';
    return content;
  }

  onAfterAttach(msg) {
    console.log(`onAfterAttach : W${this.contentPane.scrollWidth} - H${this.contentPane.scrollHeight}`);
  }

  onResize(msg) {
    console.log(`onResize : W${this.contentPane.scrollWidth} - H${this.contentPane.scrollHeight} # W${msg.width} - H${msg.height}`);
  }

  get graph() {
    return this._graph;
  }

  get flows() {
    return this._flows;
  }

  set flows(values) {
    this._flows = values;
    // Populate select component from list of samples
    // Recreate flow options
    while (this.selectElt.firstChild) {
      this.selectElt.firstChild.remove();
    }

    values.forEach((value, key) => {
      let opt = document.createElement("option");
      opt.value = key;
      opt.text = key;
      this.selectElt.add(opt);
    });
    const current = values.get(values.keys().next().value);
    if (current instanceof Error) {
      // Display Error Pane
      this.contentPane.style.display = 'none';
      this.errorPane.style.display = 'block';
      this.errorPane.innerHTML = '<code>' + current + '</code>';

    } else {
      // Display flow
      // Update flow when the selection changes 
      this.contentPane.style.display = 'block';
      this.errorPane.style.display = 'none';

      let self = this;
      this.selectElt.addEventListener('change', (event) => {
        const result = self._flows.get(event.target.value);
        self.renderFlow(result);
      });
      this.renderFlow(current);
    }
  }

  renderFlow(input) {
    if (input === undefined || input === null) {
      return;
    }

    try {
      this.renderer.render(input);

    } catch (e) {
      console.error(e);
    }

  }

}
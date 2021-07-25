/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Widget
} from '@lumino/widgets';

export class IframeELKGraphWidget extends Widget {
  private _flows: Map<any, any>;
  private selectElt: HTMLSelectElement;
  private contentPane: HTMLDivElement;
  private errorPane: HTMLDivElement;
  private iframeElt: HTMLIFrameElement;

  constructor(src: string) {
    super();
    this._flows = new Map();
    this.addClass('CodeMirrorWidget');
    this.title.label = 'PREVIEW';
    this.title.closable = false;
    this.title.caption = `Long description for ELK Graph`;

    let div = document.createElement('div');
    div.setAttribute('style', 'padding:4px;background-color: #dfdfdf;');
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute('class', 'flow-select');
    div.appendChild(this.selectElt);

    let opt = document.createElement('option');
    opt.value = 'Option 1';
    opt.text = 'Option 1';
    this.selectElt.add(opt);

    let separator = document.createElement('div');
    separator.setAttribute('class', 'separator');
    this.node.appendChild(separator);

    const content = document.createElement('div');
    content.setAttribute('class', 'app');
    this.node.appendChild(content);

    this.contentPane = this.createVisibleContentPane();
    content.appendChild(this.contentPane);

    this.errorPane = this.createVisibleContentPane(false);
    this.errorPane.style.padding = '10px';
    this.errorPane.style.fontSize = '2em';
    content.appendChild(this.errorPane);

    this.iframeElt = document.createElement('iframe');
    this.iframeElt.style.height = '100%';
    this.iframeElt.style.width = '100%';
    this.iframeElt.style.border = 'none';
    (this.iframeElt as HTMLIFrameElement).src = src;
    this.contentPane.appendChild(this.iframeElt);
    console.log(`ctor : W${this.contentPane.scrollWidth} - H${this.contentPane.scrollHeight}`);
  }

  createVisibleContentPane(visible = true) {
    const content = document.createElement('div');
    content.setAttribute('class', 'app-content-pane');
    //content.setAttribute('style', 'scroll-behavior: auto; overflow: scroll;');
    content.style.display = visible ? 'block' : 'none';
    return content;
  }

  onAfterAttach(msg: any) {
    /*
    console.log(`onAfterAttach : W${this.contentPane.scrollWidth} - H${this.contentPane.scrollHeight}`);
    //*/
  }

  onResize(msg: any) {
    /*
    console.log(`onResize : W${this.contentPane.clientWidth} - H${this.contentPane.clientHeight} # W${msg.width} - H${msg.height}`);
    //*/
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
      let opt = document.createElement('option');
      opt.value = key;
      opt.text = key;
      this.selectElt.add(opt);
    });
    const current = values.get(values.keys().next().value);
    if (current instanceof Error || typeof current === 'string') {
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
      this.selectElt.addEventListener('change', (event: Event) => {
        const result = self._flows.get((event.target as any).value);
        self.renderFlow(result);
      });
      self.renderFlow(current);
    }
  }

  renderFlow(input: any) {
    
    if (input === undefined || input === null) {
      return;
    }

    try {
      const message = { jsonrpc: '2.0', method: 'update.view', params: input };
      this.iframeElt.contentWindow?.postMessage(message, '*');
    } catch (e) {
      console.error(e);
    }
    //*/

  }

}
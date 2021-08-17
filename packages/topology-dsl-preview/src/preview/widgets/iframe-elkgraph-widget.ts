/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Widget
} from '@lumino/widgets';

export class IframeELKGraphWidget extends Widget {
  // private selectElt: HTMLSelectElement;
  private contentPane: HTMLDivElement;
  private errorPane: HTMLDivElement;
  private iframeElt: HTMLIFrameElement;

  constructor(src: string) {
    super();
    this.addClass('CodeMirrorWidget');
    this.title.label = 'PREVIEW';
    this.title.closable = false;
    this.title.caption = `Long description for ELK Graph`;

    this.addClass('app');
    //this.node.setAttribute('style', 'display:flex; flex-direction: column');

    this.errorPane = document.createElement('div');
    this.errorPane.setAttribute('style', 'display: none; flex: 1 1 auto; padding: 10px; font-size: 2em');
    this.node.appendChild(this.errorPane);

    this.iframeElt = document.createElement('iframe');
    this.iframeElt.setAttribute('style', 'display: block; flex: 1 1 auto');
    this.iframeElt.style.border = 'none';
    (this.iframeElt as HTMLIFrameElement).src = src;
    this.node.appendChild(this.iframeElt);

    this.contentPane = this.iframeElt;
    console.log(`ctor : W${this.node.scrollWidth} - H${this.node.scrollHeight}`);
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

  set flows(values: any) {
    if (values === undefined || values === null) {
      return;
    }

    if (typeof values === 'string') {
      // Display Error Pane
      this.contentPane.style.display = 'none';
      this.errorPane.style.display = 'block';
      this.errorPane.innerHTML = '<code>' + values + '</code>';

    } else {
      // Display flow
      // Update flow when the selection changes 
      this.errorPane.style.display = 'none';
      this.contentPane.style.display = 'block';

      try {
        const message = { jsonrpc: '2.0', method: 'selection.update', params: values };
        this.iframeElt.contentWindow?.postMessage(message, '*');
      } catch (e) {
        console.error(e);
      }
    }

  }

}
/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Widget
} from '@lumino/widgets';
import { Message } from '@lumino/messaging';

export class IframeELKGraphWidget extends Widget {

  private errorDivElt: HTMLDivElement;
  private contentIframeElt: HTMLIFrameElement;

  constructor(src: string) {
    super();
    this.addClass('CodeMirrorWidget');
    this.title.label = 'PREVIEW';
    this.title.closable = false;
    this.title.caption = `Long description for ELK Graph`;

    this.addClass('app');
    //this.node.setAttribute('style', 'display:flex; flex-direction: column');

    this.errorDivElt = document.createElement('div');
    this.errorDivElt.setAttribute('style', 'display: none; flex: 1 1 auto; padding: 10px; font-size: 2em');
    this.node.appendChild(this.errorDivElt);

    this.contentIframeElt = document.createElement('iframe');
    this.contentIframeElt.setAttribute('style', 'display: block; flex: 1 1 auto; border: none;');

    (this.contentIframeElt as HTMLIFrameElement).src = src;
    this.node.appendChild(this.contentIframeElt);

  }

  updateView(event: any) {
    if (event === undefined || event === null) {
      return;
    }
    console.log('event => ' + event.method);
    if (event.method === 'view.error') {
      // Display Error Pane
      this.contentIframeElt.style.display = 'none';
      this.errorDivElt.style.display = 'block';
      this.errorDivElt.innerHTML = '<code>' + event.params + '</code>';

    } else if (event.method === 'view.update') {
      // Display flow
      // Update flow when the selection changes 
      this.errorDivElt.style.display = 'none';
      this.contentIframeElt.style.display = 'block';

      try {
        const message = { jsonrpc: '2.0', method: 'selection.update', params: event.params };
        this.contentIframeElt.contentWindow?.postMessage(message, '*');
      } catch (e) {
        console.error(e);
      }
    }

  }

}
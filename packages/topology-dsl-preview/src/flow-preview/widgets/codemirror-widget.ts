/* tslint:disable */ 
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Message
} from '@lumino/messaging';

import {
  Widget
} from '@lumino/widgets';

import { ISignal, Signal } from '@lumino/signaling';

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/addon/display/panel.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";
import '../style/index.css';

//import "tslint";
//globalThis.JSHINT = JSHINT;

/**
 * A widget which hosts a CodeMirror editor.
 */
export class CodeMirrorWidget extends Widget {

  constructor(config?: CodeMirror.EditorConfiguration) {
    super();
    this.addClass('CodeMirrorWidget');

    let div = document.createElement('div');
    div.setAttribute("style","padding:4px;background-color: #dfdfdf;");
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute("class","flow-select");

    div.appendChild(this.selectElt);

    let opt = document.createElement('option');
    opt.value = "Option 1";
    opt.text = "Option 1";
    this.selectElt.add(opt);

    let separator = document.createElement('div');
    separator.setAttribute("class","separator");
    this.node.appendChild(separator);

    let content = document.createElement('div');
    content.setAttribute("class","content-pane");
    this.node.appendChild(content);
    
    this._editor = CodeMirror(content, config);
  }

  get editor(): CodeMirror.Editor {
    return this._editor;
  }

  get content(): string {
    return this._editor.getDoc().getValue();
  }

  set content(text:string) {
    this._editor.getDoc().setValue(text);
  }

  loadTarget(target: string): void {
    var doc = this._editor.getDoc();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', target);
    xhr.onreadystatechange = () => doc.setValue(xhr.responseText);
    xhr.send();
  }

  protected onAfterAttach(msg: Message): void {
    this._editor.refresh();
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    if (msg.width < 0 || msg.height < 0) {
      this._editor.refresh();
    } else {
      this._editor.setSize(msg.width, msg.height);
    }
  }
  // samples
  set samples(values:Array<string>){
    this._samples = values;
    // Populate select component from list of samples
    // Recreate sample options
    while (this.selectElt.firstChild) {
      this.selectElt.firstChild.remove();
    }

    values.forEach((value,index) => {
      let opt:HTMLOptionElement = document.createElement("option");
      opt.value = index.toString();
      opt.text = `Sample #${index +1}`;
      this.selectElt.add(opt);
    });
    // Update sample when the selection changes 
    this.selectElt.addEventListener('change', (event:Event) => {
      const result:string = this._samples[parseInt((event.target as HTMLSelectElement).value,10)];
      // Update Editor with current selection 
      this._editor.getDoc().setValue(result);
      this._valueChanged.emit(result);
    });
    // Set default
    this._editor.getDoc().setValue(this._samples[0]);
  }

  get valueChanged(): ISignal<this, string> {
    return this._valueChanged;
  }

  private _valueChanged = new Signal<this, string>(this);
  private _editor: CodeMirror.Editor;
  private selectElt: HTMLSelectElement;
  private _samples: Array<string> = [];

}

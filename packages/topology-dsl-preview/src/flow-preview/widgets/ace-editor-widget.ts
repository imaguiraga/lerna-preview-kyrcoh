/* tslint:disable */ 
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Message
} from '@lumino/messaging';

import {
  Widget
} from '@lumino/widgets';

import { ISignal, Signal } from '@lumino/signaling';

import * as ace from "ace-builds";
import '../style/index.css';

ace.config.set("basePath", "https://ajaxorg.github.io/ace-builds/src-noconflict");

//import "tslint";
//globalThis.JSHINT = JSHINT;

/**
 * A widget which hosts a Ace editor.
 */
export class AceEditorWidget extends Widget {

  constructor(config?: ace.Ace.EditorOptions) {
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
    content.setAttribute("class","AceEditorWidget");
    this.node.appendChild(content);
    
    const editor = ace.edit(content, config || {
      mode: "ace/mode/javascript",
     // selectionStyle: "text",
      autoScrollEditorIntoView: true,
      copyWithEmptySelection: true,
      enableAutoIndent: true,
      hScrollBarAlwaysVisible: true,
      vScrollBarAlwaysVisible: true,
      theme: "ace/theme/textmate",
      showPrintMargin: true
    });

    editor.session.setTabSize(2);
    editor.renderer.setScrollMargin(0,10,10,10);
    this._editor = editor;

    let self = this;
    self.editor.session.on('change', function(delta: ace.Ace.Delta) {
      // delta.start, delta.end, delta.lines, delta.action
      // Emit changes
      let content = self.editor.getValue();
      self._valueChanged.emit(content);
    });

    
    

  }

  get editor(): any {
    return this._editor;
  }

  get content(): string {
    return this._editor.getValue();
  }

  set content(text:string) {
    this._editor.setValue(text,-1);
  }

  loadTarget(target: string): void {
    var doc = this._editor;
    fetch(target)
    .then(response => response.json())
    .then( function(data) { 
      doc.setValue(data,-1);
    });
  }

  protected onAfterAttach(msg: Message): void {

  }

  protected onResize(msg: Widget.ResizeMessage): void {
    this._editor.container.setAttribute("width",msg.width.toString());
    if (msg.width > 0 && msg.height > 0) {
      this._editor.container.style.width = msg.width + "px";
      this._editor.container.style.height = msg.height + "px";
      this._editor.resize();
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
      this._editor.setValue(result,-1);
      this._valueChanged.emit(result);
    });
    // Set default
    this._editor.setValue(this._samples[0],-1);
  }

  get valueChanged(): ISignal<this, string> {
    return this._valueChanged;
  }

  private _valueChanged = new Signal<this, string>(this);
  private _editor: ace.Ace.Editor;
  private selectElt: HTMLSelectElement;
  private _samples: Array<string> = [];

}

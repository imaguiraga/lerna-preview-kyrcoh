/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Message
} from '@lumino/messaging';

import {
  Widget
} from '@lumino/widgets';

import { ISignal, Signal } from '@lumino/signaling';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/display/panel.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/lint/lint.css';
import '../style/widget-style.css';

//import 'tslint';
//globalThis.JSHINT = JSHINT;

/**
 * A widget which hosts a CodeMirror editor.
 */
export class CodeMirrorWidget extends Widget {

  constructor(config?: CodeMirror.EditorConfiguration) {
    super();
    this.addClass('CodeMirrorWidget');

    const div = document.createElement('div');
    div.setAttribute('style', 'background-color: #dfdfdf;');
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute('class', 'flow-select');

    div.appendChild(this.selectElt);

    const opt = document.createElement('option');
    opt.value = 'Option 1';
    opt.text = 'Option 1';
    this.selectElt.add(opt);

    const content = document.createElement('div');
    content.setAttribute('class', 'CodeMirrorWidget');
    this.node.appendChild(content);

    this._editor = CodeMirror(content, config);
    const self = this;
    self.editor.on('changes', (instance) => {
      // Emit changes
      const content = instance.getDoc().getValue();
      self._valueChanged.emit(content);

    });

    // Update sample when the selection changes 
    this.selectElt.addEventListener('change', (event: Event) => {
      const result: string = self.getSamples().get((event.target as HTMLSelectElement).value) || '';
      // Update Editor with current selection 
      self.editor.getDoc().setValue(result);
      self._valueChanged.emit(result);
    });
  }

  get editor(): CodeMirror.Editor {
    return this._editor;
  }

  get content(): string {
    return this._editor.getDoc().getValue();
  }

  set content(text: string) {
    this._editor.getDoc().setValue(text);
  }

  loadTarget(target: string): void {
    const doc = this._editor.getDoc();
    fetch(target)
      .then(response => response.json())
      .then(function (data) {
        doc.setValue(data);
      });
  }

  onAfterAttach(msg: Message): void {
    this._editor.refresh();
  }

  onResize(msg: Widget.ResizeMessage): void {
    if (msg.width < 0 || msg.height < 0) {
      this._editor.refresh();
    } else {
      this._editor.setSize(msg.width, msg.height);
    }
  }

  getSamples() {
    return this._samples;
  }
  // samples
  set samples(values: Array<string>) {
    // Convert to Map
    this._samples = new Map();
    // Populate select component from list of samples
    // Recreate sample options
    while (this.selectElt.firstChild) {
      this.selectElt.firstChild.remove();
    }

    values.forEach((value, index) => {
      const opt: HTMLOptionElement = document.createElement('option');
      opt.value = index.toString();
      opt.text = `Sample #${index + 1}`;
      if (isScript(value)) {
        opt.text = `Sample #${index + 1} - ${value}`;
        fetch(value).then((res) => {
          return res.text();
        }).then((text) => {
          this._samples.set(opt.value, text);
        });
      } else {
        this._samples.set(opt.value, value);
      }

      this.selectElt.add(opt);
    });

    // Set default
    // this._editor.getDoc().setValue(this.getSamples().get('0') || '');
  }

  updateEditorContent(text: string|undefined) {
    // Set default
    if (text === undefined || text === null) {
      this._editor.getDoc().setValue((this.getSamples().get('0') as string));
    } else {
      this._editor.getDoc().setValue(text);
    }
  }

  get valueChanged(): ISignal<this, string> {
    return this._valueChanged;
  }

  private _valueChanged = new Signal<this, string>(this);
  private _editor: CodeMirror.Editor;
  private selectElt: HTMLSelectElement;
  private _samples: Map<string, string> = new Map();

}

function isScript(source: any) {
  return (/\.(tsx?|jsx?)$/.test(source));
}
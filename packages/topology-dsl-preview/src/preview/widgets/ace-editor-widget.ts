/* tslint:disable */
import 'es6-promise/auto';  // polyfill Promise on IE

import {
  Message
} from '@lumino/messaging';

import {
  Widget
} from '@lumino/widgets';

import { ISignal, Signal } from '@lumino/signaling';

import * as ace from 'ace-builds';
import '../style//widget-style.css';

ace.config.set('basePath', 'https://ajaxorg.github.io/ace-builds/src-noconflict');

//import 'tslint';
//globalThis.JSHINT = JSHINT;

/**
 * A widget which hosts a Ace editor.
 */
export class AceEditorWidget extends Widget {

  constructor(config?: ace.Ace.EditorOptions) {
    super();
    this.addClass('CodeMirrorWidget');

    const div = document.createElement('div');
    div.setAttribute('style', 'padding:4px;background-color: #dfdfdf;');
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute('class', 'flow-select');

    div.appendChild(this.selectElt);

    const opt = document.createElement('option');
    opt.value = 'Option 1';
    opt.text = 'Option 1';
    this.selectElt.add(opt);

    const separator = document.createElement('div');
    separator.setAttribute('class', 'separator');
    this.node.appendChild(separator);

    const content = document.createElement('div');
    content.setAttribute('class', 'AceEditorWidget');
    this.node.appendChild(content);

    const editor = ace.edit(content, config || {
      mode: 'ace/mode/javascript',
      // selectionStyle: 'text',
      autoScrollEditorIntoView: true,
      copyWithEmptySelection: true,
      enableAutoIndent: true,
      hScrollBarAlwaysVisible: true,
      vScrollBarAlwaysVisible: true,
      theme: 'ace/theme/textmate',
      showPrintMargin: true
    });

    editor.session.setTabSize(2);
    editor.renderer.setScrollMargin(0, 10, 10, 10);
    this._editor = editor;

    const self = this;
    self.editor.session.on('change', function (delta: ace.Ace.Delta) {
      // delta.start, delta.end, delta.lines, delta.action
      // Emit changes
      const content = self.editor.getValue();
      self._valueChanged.emit(content);

    });
  }

  get editor(): any {
    return this._editor;
  }

  get content(): string {
    return this._editor.getValue();
  }

  set content(text: string) {
    this._editor.setValue(text, -1);
  }

  loadTarget(target: string): void {
    const doc = this._editor;
    fetch(target)
      .then(response => response.json())
      .then(function (data) {
        doc.setValue(data, -1);
      });
  }

  onAfterAttach(msg: Message): void {

  }

  onResize(msg: Widget.ResizeMessage): void {
    this._editor.container.setAttribute('width', msg.width.toString());
    if (msg.width > 0 && msg.height > 0) {
      this._editor.container.style.width = msg.width + 'px';
      this._editor.container.style.height = msg.height + 'px';
      this._editor.resize();
    }
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
    // Update sample when the selection changes 
    this.selectElt.addEventListener('change', (event: Event) => {
      const result: string = this._samples.get((event.target as HTMLSelectElement).value) || '';
      // Update Editor with current selection 
      this._editor.setValue(result, -1);
      this._valueChanged.emit(result);
    });
    // Set default
    this._editor.setValue(this._samples.get('0') || '', -1);
  }

  get valueChanged(): ISignal<this, string> {
    return this._valueChanged;
  }

  private _valueChanged = new Signal<this, string>(this);
  private _editor: ace.Ace.Editor;
  private selectElt: HTMLSelectElement;
  private _samples: Map<string, string> = new Map();

}

function isScript(source: any) {
  return (source.endsWith('.js') || source.endsWith('.jsx') || source.endsWith('.ts') || source.endsWith('.tsx'));
}
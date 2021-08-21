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

// Linting
import { JSHINT } from 'jshint';
// eslint-disable-next-line
(globalThis as any).JSHINT = JSHINT;

/**
 * A widget which hosts a Ace editor.
 */
export class AceEditorWidget extends Widget {

  constructor(config?: any) {
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
    content.setAttribute('class', 'AceEditorWidget');
    this.node.appendChild(content);
    const self = this;
    const defaultConfig = {
      mode: 'ace/mode/typescript',
      // selectionStyle: 'text',
      autoScrollEditorIntoView: true,
      copyWithEmptySelection: true,
      enableAutoIndent: true,
      hScrollBarAlwaysVisible: false,
      vScrollBarAlwaysVisible: false,
      theme: 'ace/theme/sqlserver',
      showPrintMargin: true,
      fontFamily: 'monospace',
      fontSize: '13px'
    };

    const editor = ace.edit(content, config || defaultConfig);

    editor.session.setTabSize(2);
    editor.renderer.setScrollMargin(0, 10, 10, 10);
    this._editor = editor;

    self.editor.session.on('change', function (delta: ace.Ace.Delta) {
      // Emit changes delta.start, delta.end, delta.lines, delta.action
      const content = self.editor.getValue();
      self._valueChanged.emit({
        key: self.selectElt.selectedOptions[0].text,
        content: content
      });

    });

    // Update sample when the selection changes 
    this.selectElt.addEventListener('change', (event: Event) => {
      const elt = (event.target as HTMLSelectElement);
      const result: string = self.getSamples().get(elt.value) || '';
      // Update Editor with current selection 
      self.content = result;
      self._valueChanged.emit({
        key: elt.selectedOptions[0].text,
        content: result
      });
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  }

  updateEditorContent(text: string | undefined) {
    // Set default
    if (text === undefined || text === null) {
      this.content = (this.getSamples().get('0') as string);
    } else {
      this.content = text;
    }
  }

  get valueChanged(): ISignal<this, any> {
    return this._valueChanged;
  }

  private _valueChanged = new Signal<this, any>(this);
  private _editor: ace.Ace.Editor;
  private selectElt: HTMLSelectElement;
  private _samples: Map<string, string> = new Map();

}

function isScript(source: any) {
  return (/\.(tsx?|jsx?)$/.test(source));
}
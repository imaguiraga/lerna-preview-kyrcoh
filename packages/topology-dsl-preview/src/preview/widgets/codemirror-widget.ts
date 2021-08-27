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
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/addon/display/panel.js';
// Linting
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/lint/lint.css';
// Search
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/matchesonscrollbar.css';

import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/jump-to-line.js';
// Folding
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/mode/javascript/javascript.js';
// Brackets
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';

import '../style/widget-style.scss';

// Linting
import { JSHINT } from 'jshint';
// eslint-disable-next-line
(globalThis as any).JSHINT = JSHINT;
// Override default brace add-on
CodeMirror.registerHelper('fold', 'brace', function (cm: any, start: any) {
  var line = start.line, lineText = cm.getLine(line);
  var tokenType;

  function findOpening(openCh: any) {
    for (var at = start.ch, pass = 0; ;) {
      var found = at <= 0 ? -1 : lineText.lastIndexOf(openCh, at - 1);
      if (found == -1) {
        if (pass == 1) break;
        pass = 1;
        at = lineText.length;
        continue;
      }
      if (pass == 1 && found < start.ch) break;
      tokenType = cm.getTokenTypeAt(CodeMirror.Pos(line, found + 1));
      if (!/^(comment|string)/.test(tokenType)) return found + 1;
      at = found - 1;
    }
  }

  var startBrace = findOpening('{'), startBracket = findOpening('['), startParenthesis = findOpening('(');
  var startToken, endToken, startCh;
  if (startBrace != null && (startBracket == null || startBracket > startBrace)) {
    startCh = startBrace; startToken = '{'; endToken = '}';
  } else if (startBracket != null) {
    startCh = startBracket; startToken = '['; endToken = ']';
  } else if (startParenthesis != null) {
    startCh = startParenthesis; startToken = '('; endToken = ')';
  } else {
    return;
  }

  var count = 1, lastLine = cm.lastLine(), end, endCh;
  outer: for (var i = line; i <= lastLine; ++i) {
    var text = cm.getLine(i), pos = i == line ? startCh : 0;
    for (; ;) {
      var nextOpen = text.indexOf(startToken, pos), nextClose = text.indexOf(endToken, pos);
      if (nextOpen < 0) nextOpen = text.length;
      if (nextClose < 0) nextClose = text.length;
      pos = Math.min(nextOpen, nextClose);
      if (pos == text.length) break;
      if (cm.getTokenTypeAt(CodeMirror.Pos(i, pos + 1)) == tokenType) {
        if (pos == nextOpen) ++count;
        else if (!--count) { end = i; endCh = pos; break outer; }
      }
      ++pos;
    }
  }
  if (end == null || line == end) return;
  return {
    from: CodeMirror.Pos(line, startCh),
    to: CodeMirror.Pos(end, endCh)
  };
});
/**
 * A widget which hosts a CodeMirror editor.
 */
export class CodeMirrorWidget extends Widget {
  private fileInput: HTMLInputElement;
  private _valueChanged = new Signal<this, any>(this);
  private _editor: CodeMirror.Editor;
  private selectElt: HTMLSelectElement;
  private _samples: Map<string, string> = new Map();

  constructor(config?: any) {
    super();
    this.addClass('CodeMirrorWidget');

    const div = document.createElement('div');
    div.setAttribute('style', 'background-color: #dfdfdf;display: flex; gap:4px;');
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute('class', 'flow-select');

    div.appendChild(this.selectElt);

    const opt = document.createElement('option');
    opt.value = 'Option 1';
    opt.text = 'Option 1';
    this.selectElt.add(opt);

    // SAVE
    let btn: HTMLButtonElement = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = '<span>SAVE</span>';
    btn.setAttribute('style', 'flex: 0 0!important;border-radius: 0');
    btn.setAttribute('class', 'btn btn-primary');
    div.appendChild(btn);
    // FILE NAME
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'text';
    this.fileInput.placeholder = 'Enter filename';
    this.fileInput.setAttribute('style', 'flex: 1 1!important;border: none;border-radius: 0');
    div.appendChild(this.fileInput);

    // DOWNLOAD
    btn = document.createElement('button');
    btn.type = 'button';
    //btn.innerHTML = '<span>DOWNLOAD</span>';
    btn.setAttribute('style', 'flex: 0 0!important;border-radius: 0');
    btn.setAttribute('class', 'btn btn-primary bi bi-download');
    btn.addEventListener('click', (evt) => {
      this.download();
    });
    div.appendChild(btn);

    const content = document.createElement('div');
    content.setAttribute('class', 'CodeMirrorWidget');
    this.node.appendChild(content);
    const self = this;
    const defaultConfig = {
      mode: 'text/typescript',
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      lint: {
        'esversion': '8',
        'laxcomma': true
      },
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],
      scrollbarStyle: 'simple',
      tabSize: 2,
      matchBrackets: true,
      extraKeys: {
        'Ctrl-C': function copyText() {
          navigator.clipboard.writeText(self.editor.getSelection()).then(function () {
            /* clipboard successfully set */
          }, function () {
            /* clipboard write failed */
          });
        },
        'Ctrl-X': function cutText() {
          // Copy
          navigator.clipboard.writeText(self.editor.getSelection()).then(function () {
            /* clipboard successfully set */
          }, function () {
            /* clipboard write failed */
          });
          // Delete
          self.editor.replaceSelection('');
        },
        'Ctrl-V': function pasteText() {
          navigator.clipboard.readText().then(
            clipText => {
              const doc = self.editor.getDoc();
              const cursor = doc.getCursor();

              const pos = {
                line: cursor.line,
                ch: cursor.ch
              };

              doc.replaceRange(clipText, pos);
            }
          );
        },
      }
    };
    this._editor = CodeMirror(content, config || defaultConfig);

    self.editor.on('changes', (instance) => {
      // Emit changes
      const content = instance.getDoc().getValue();
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
      self.fileInput.value = elt.selectedOptions[0].text.split('-')[0].trim();
    });
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
    this.fileInput.value = this.selectElt.selectedOptions[0].text.split('-')[0].trim();
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

  download() {
    // Convert the text to BLOB.
    const textToBLOB = new Blob([this.content], { type: 'text/plain' });
    const sFileName = this.fileInput.value + '.djs' || 'download.djs';	   // The file to save the data.

    let newLink = document.createElement('a');
    newLink.download = sFileName;

    if (window.webkitURL != null) {
      newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
      newLink.href = window.URL.createObjectURL(textToBLOB);
    }

    newLink.click();

  }

}

function isScript(source: any) {
  return (/\.(tsx?|jsx?)$/.test(source));
}
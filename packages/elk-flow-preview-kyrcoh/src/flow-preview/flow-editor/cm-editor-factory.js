
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";
//import "jshint/src/jshint.js";
//import * as jshint from "jshint";
import { JSHINT } from "jshint";
window.JSHINT = JSHINT;

/**
 * Create a Code.
 * @param {object} container - The container.
 * @param {string} content - The content.
 * @param {string} mode - The mode.
 * @return {object} The CodeMirror object.
 */
export function createEditor(container, content, mode){
    let containerElt = (typeof container === "string") ? document.getElementById(container) : container;
  // Initialize Editor Pane
    let editor = CodeMirror(
    containerElt, {
        value: content,
        mode: mode || "javascript",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 40,
        foldGutter: true,
        lint: { 'esversion': '8' }, 
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
    });

  return editor;
}

import ace from "ace-builds";//src-noconflict/ace.js";
import "ace-builds/webpack-resolver.js";

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
export function createEditor(container, content, mode) {
  let containerElt = (typeof container === "string") ? document.getElementById(container) : container;
  // Initialize Editor Pane
  // pass options to ace.edit
  let editor = ace.edit(containerElt, {
    mode: mode || "ace/mode/javascript",
    selectionStyle: "text"
  });
  // use setOptions method to set several options at once
  editor.setOptions({
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true,
  });
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");

  editor.setValue(content);

  return editor;
}
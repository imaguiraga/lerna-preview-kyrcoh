/* tslint:disable */ 
import 'es6-promise/auto';  // polyfill Promise on IE

import {
 Widget
} from '@lumino/widgets';

import * as diagram from "../pipeline-diagram";

export class G6GraphWidget extends Widget {

  constructor(_width,_height) {
    super();
    this._pipelines = new Map();
    this.addClass('CodeMirrorWidget');
    this.title.label = "Pipeline PREVIEW";
    this.title.closable = false;
    this.title.caption = `Long description for:G6 Graph`;

    let div = document.createElement('div'); 
    div.setAttribute("style","padding:4px;background-color: #dfdfdf;");
    this.node.appendChild(div);

    this.selectElt = document.createElement('select');
    this.selectElt.setAttribute("class","pipeline-select");
    div.appendChild(this.selectElt);
    
    let opt = document.createElement('option');
    opt.value = "Option 1";
    opt.text = "Option 1";
    this.selectElt.add(opt);
    
    let separator = document.createElement('div');
    separator.setAttribute("class","separator");   
    this.node.appendChild(separator);

    this.content = document.createElement('div');
    this.content.setAttribute("class","content-pane");
    this.content.setAttribute("style","scroll-behavior: auto;overpipeline: scroll;");
    this.node.appendChild(this.content);

    this._graph = diagram.createPipelineDiagram(this.content,_width,_height);
    this._graph.data([]);
    this._graph.fitView(20); 
    this._graph.render();

    console.log(`ctor : W${this.content.scrollWidth} - H${this.content.scrollHeight}`);
  }

  onAfterAttach(msg) {   
    console.log(`onAfterAttach : W${this.content.scrollWidth} - H${this.content.scrollHeight}`);
  }

  onResize(msg) {
    console.log(`onResize : W${this.content.scrollWidth} - H${this.content.scrollHeight} # W${msg.width} - H${msg.height}`);
    if(msg.width > 0 && msg.height > 0 ){
        
        this._graph.changeSize(
            Math.max(this.content.clientWidth,this.node.clientWidth), 
            Math.max(this.content.clientHeight,this.node.clientHeight)
        ); 
        this._graph.fitView(20); 
        this._graph.render();
        
    }
  }
  
  get graph(){
    return this._graph;
  }

  get pipelines(){
    return this._pipelines;
  }

  set pipelines(values){
    this._pipelines = values;
    // Populate select component from list of samples
    // Recreate pipeline options
    while (this.selectElt.firstChild) {
      this.selectElt.firstChild.remove();
    }

    values.forEach((value,key) => {
      let opt = document.createElement("option");
      opt.value = key;
      opt.text = key;
      this.selectElt.add(opt);
    });
    // Update pipeline when the selection changes 
    let self = this;
    this.selectElt.addEventListener('change', (event) => {
      const result = self._pipelines.get(event.target.value);
      self.setData(result);
    });
    this.setData(values.get(values.keys().next().value));
  }

  setData(_data){
    // resise when data changes
    this._graph.changeSize(
        Math.min(this.content.clientWidth,this.node.clientWidth), 
        Math.min(this.content.clientHeight,this.node.clientHeight)
    );    
    this._graph.data(_data);
    this._graph.fitView(20); 
    this._graph.render();
  }

}
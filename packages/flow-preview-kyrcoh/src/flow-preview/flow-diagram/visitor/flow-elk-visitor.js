/**
 * Class FlowToELKVisitor.
 */
export class FlowToELKVisitor {
  constructor(){
    this.edgeCnt = 0;
  }
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  visit(tree,filterFn){
    let result = null;
    if( typeof tree === "undefined"){
      return result;
    }
    switch(tree.tagName){
      case "choice":
        result = this._visitChoice(tree,filterFn);
      break;
      case "optional":
        result = this._visitOptional(tree,filterFn);
      break;
      case "sequence":
        result = this._visitSequence(tree,filterFn);
      break;
      case "repeat":
        result = this._visitRepeat(tree,filterFn);
      break;
      case "parallel":
        result = this._visitParallel(tree,filterFn);
      break;
      case "terminal":
        result = this._visitTerminal(tree,filterFn);
      break;
      default:
      break;

    }
    // TODO this.updateWdith(result);
    return result;
  }

  updateWdith(result) {
    if( result && result.nodes) {
      result.nodes.forEach((n) => {
        n.width = (n.label.length + 4) * 8;
      });
    }

  }

  _visitSequence(tree,filterFn){
    return SequenceEltFlowToELKVisitor.visit(this,tree,filterFn);
  }

  _visitChoice(tree,filterFn){
    return MutltiPathEltFlowToELKVisitor.visit(this,tree,filterFn,"choice");
  }

  _visitParallel(tree,filterFn){
    return MutltiPathEltFlowToELKVisitor.visit(this,tree,filterFn,"parallel");
  }

  _visitOptional(tree,filterFn){
    return OptionalEltFlowToELKVisitor.visit(this,tree,filterFn);
  }

  _visitRepeat(tree,filterFn){
    return RepeatEltFlowToELKVisitor.visit(this,tree,filterFn);
  }

  _visitTerminal(tree,filterFn){
    return TerminalFlowEltFlowToELKVisitor.visit(this,tree,filterFn);
  }
}

/**
 * Class TerminalFlowEltFlowToELKVisitor.
 */
class TerminalFlowEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const data = {
      children: [],
      edges: []
    };

    let n = {
      id: tree.id,
      label: tree.id ,
      model: { 
        resourceType: tree.resourceType,  
        tagName: 'terminal'
      },
      labels: [
        {
          text: tree.id
        } 
      ],
    };
    if (filterFn) {
      if (!filterFn(n)) {
        data.children.push(n);
      }
    } else {
      data.children.push(n);
    }
    return data;
  }

}

/**
 * Class SequenceEltFlowToELKVisitor.
 */
class SequenceEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn) {
    const SEQUENCE = "sequence";
    const data = {
      children: [],
      edges: []
    };
    if (tree.tagName !== SEQUENCE) {
      return data;
    }
    // start + finish nodes
    data.children.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: SEQUENCE+'.start'
      },
      labels: [
        {
          text: tree.start.id
        } 
      ],
    });
    // nodes
    if (tree.tagName === SEQUENCE) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: { 
            resourceType: node.resourceType,  
            tagName: SEQUENCE+'.terminal'
          },
          labels: [
            {
              text: node.id
            } 
          ],
        };
        if (filterFn) {
          if (!filterFn(n)) {
            data.children.push(n);
          }
        } else {
          data.children.push(n);
        }
      });
    }
    data.children.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: { 
        resourceType: tree.resourceType,  
        tagName: SEQUENCE+'.finish'
      },
      labels: [
        {
          text: tree.finish.id
        } 
      ],

    });
    // edges
    visitor.edgeCnt = visitor.edgeCnt+1;
    data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: SEQUENCE
        },
      });

    for (let i = 0; i < tree.elts.length - 1; i++) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[i].finish.id],
        targets: [tree.elts[i + 1].start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: SEQUENCE
        },
      });
    }

    visitor.edgeCnt = visitor.edgeCnt+1;
    data.edges.push({
      id: `${visitor.edgeCnt}`,
      sources: [tree.elts[tree.elts.length - 1].finish.id],
      targets: [tree.finish.id],
      model: { 
        resourceType: tree.resourceType,
        tagName: SEQUENCE
      },
    });
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        data.children = data.children.concat(g6.children);
        data.edges = data.edges.concat(g6.edges);
      }
    });

    return data;
  }
}

/**
 * Class MutltiPathEltFlowToELKVisitor.
 */
class MutltiPathEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn,type){
    //const type = "choice" | "parallel";
    const data = {
      children: [],
      edges: []
    };
    //
    if (tree.tagName !== type) {
      return data;
    }
    // start + finish nodes
    data.children.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: type+'.start'
      },
      labels: [
        {
          text: tree.start.id
        } 
      ],
    });

    // nodes
    if (tree.tagName === type) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id,
          model: {
            resourceType: node.resourceType,   
            tagName: type+'.terminal'
          },
          labels: [
            {
              text: node.id
            } 
          ],
        };

        if (filterFn) {
          if (!filterFn(n)) {
            data.children.push(n);
          }
        } else {
          data.children.push(n);
        }
      });
    }
    data.children.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: {
        resourceType: tree.resourceType,   
        tagName: type+'.finish'
      },
      labels: [
        {
          text: tree.finish.id
        } 
      ],
    });
    // edges
    for (let i = 0; i < tree.elts.length; i++) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[i].start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: type
        },
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[i].finish.id],
        targets: [tree.finish.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: type
        },
      });
    }
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        data.children = data.children.concat(g6.children);
        data.edges = data.edges.concat(g6.edges);
      }
    });

    return data;
  }
  
}

/**
 * Class OptionalEltFlowToELKVisitor.
 */
class OptionalEltFlowToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn) {
    const OPTIONAL = "optional";
    const data = {
      children: [],
      edges: []
    };
    if (tree.tagName !== OPTIONAL) {
      return data;
    }
    // start node
    data.children.push({
      id: tree.start.id,
      label: tree.start.id ,
      model: {
        resourceType: tree.resourceType,   
        tagName: OPTIONAL+'.start'
      },
      labels: [
        {
          text: tree.start.id
        } 
      ],
    });

    // skip node
    if(tree.skip) {
      data.children.push({
        id: tree.skip.id,
        model: {
          resourceType: tree.resourceType,   
          tagName: OPTIONAL+'.skip'
        },
        labels: [
          {
            text: tree.skip.id
          } 
        ],
      });
    }

    // nodes
    if (tree.tagName === OPTIONAL) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: { 
            resourceType: node.resourceType,  
            tagName: OPTIONAL+'.terminal'
          },
          labels: [
            {
              text: node.id
            } 
          ],
        };
        if (filterFn) {
          if (!filterFn(n)) {
            data.children.push(n);
          }
        } else {
          data.children.push(n);
        }
      });
    }
    data.children.push({
      id: tree.finish.id,
      label: tree.finish.id ,
      model: { 
        resourceType: tree.resourceType,  
        tagName: OPTIONAL+'.finish'
      },
      labels: [
        {
          text: tree.finish.id
        } 
      ],
    });
    // edges

    if(tree.elts.length > 0) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[tree.elts.length-1].finish.id],
        targets: [tree.finish.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
    }

    // start -> skip? -> finish
    if(typeof(tree.skip) !== "undefined"){
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.skip.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.skip.id],
        targets: [tree.finish.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
    } else {
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.finish.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: OPTIONAL
        },
      });
    }
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        data.children = data.children.concat(g6.children);
        data.edges = data.edges.concat(g6.edges);
      }
    });

    return data;
  }
}

/**
 * Class RepeatEltFlowToELKVisitor.
 */
class RepeatEltFlowToELKVisitor {
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @return {object} g6 Graph data.
   */
  static visit(visitor,tree,filterFn) {
    const REPEAT = "repeat";
    const data = {
      children: [],
      edges: []
    };
    if (tree.tagName !== REPEAT) {
      return data;
    }
    // start node
    data.children.push({
      id: tree.start.id,
      label: tree.start.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: REPEAT+'.start'
      },
      labels: [
        {
          text: tree.start.id
        } 
      ],
    });

    // loop node
    if(tree.loop) {
      data.children.push({
        id: tree.loop.id,
        model: {
          resourceType: tree.resourceType,   
          tagName: REPEAT+'.loop'
        },
        labels: [
          {
            text: tree.loop.id
          } 
        ],
      });
    }
    // nodes
    if (tree.tagName === REPEAT) {
      tree.elts.forEach(node => {
        // keep only terminal nodes
        if (!node.isTerminal()) {
          return;
        }
        let n = {
          id: node.id,
          label: node.id ,
          model: {
            resourceType: node.resourceType,   
            tagName: REPEAT+'.terminal'
          },
          labels: [
            {
              text: node.id
            } 
          ],
        };
        if (filterFn) {
          if (!filterFn(n)) {
            data.children.push(n);
          }
        } else {
          data.children.push(n);
        }
      });
    }

    // finish node
    data.children.push({
      id: tree.finish.id,
      label: tree.finish.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: REPEAT+'.finish'
      },
      labels: [
        {
          text: tree.finish.id
        } 
      ],
    });
    // edges
    if(tree.elts.length > 0) {
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.elts[tree.elts.length-1].finish.id],
        targets: [tree.finish.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
    }

    // start <- loop <- finish
    // reverse the arrow direction
    if(typeof(tree.loop) !== "undefined"){
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.loop.id],
        style: {
          startArrow: true,
          endArrow: false,
        },
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.loop.id],
        targets: [tree.finish.id],
        style: {
          startArrow: true,
          endArrow: false,
        },
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
    } else {
      visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.finish.id],
        targets: [tree.start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: REPEAT
        },
      });
    }
    //*/
    
    // concatenate G6 graphs

    tree.elts.forEach(elt => {
      let g6 = elt.accept(visitor,n => tree.foundElt(n));
      if(g6 !== null) {
        data.children = data.children.concat(g6.children);
        data.edges = data.edges.concat(g6.edges);
      }
    });
    return data;
  }
}
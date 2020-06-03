/**
 * Class PipelineToELKVisitor.
 */
export class PipelineToELKVisitor {
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
      case "data":
        result = TerminalPipelineToELKVisitor.visit(this,tree,filterFn);
      break;
      case "step":
        result = TerminalPipelineToELKVisitor.visit(this,tree,filterFn);
      break;
      case "job":
        result = MutltiPathToELKVisitor.visit(this,tree,filterFn,"job");
      break;
      case "stage":
        result = MutltiPathToELKVisitor.visit(this,tree,filterFn,"stage");
      break;
      case "parallel":
        result = MutltiPathToELKVisitor.visit(this,tree,filterFn,"parallel");
      break;
      case "sequence":
        result = SequenceEltFlowToELKVisitor.visit(this,tree,filterFn,"sequence");
      break;
      case "pipeline":
        result = SequenceEltFlowToELKVisitor.visit(this,tree,filterFn,"pipeline");
      break;
      default:
      break;

    }
    return result;
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
   * @param {string} type - The dsl type. 
   * @return {object} g6 Graph data.
   */  
  static visit(visitor,tree,filterFn,type){
    const data = {
      children: [],
      edges: []
    };
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
      }
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
          label: node.title,
          model: { 
            resourceType: node.resourceType,  
            tagName: type+'.terminal'
          }
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
      label: tree.finish.id,
      model: { 
        resourceType: tree.resourceType,  
        tagName: type+'.finish'
      }
    });
    // edges
    visitor.edgeCnt = visitor.edgeCnt+1;
      data.edges.push({
        id: `${visitor.edgeCnt}`,
        sources: [tree.start.id],
        targets: [tree.elts[0].start.id],
        model: { 
          resourceType: tree.resourceType,
          tagName: type
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
          tagName: type
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
        tagName: type
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
 * Class TerminalPipelineToELKVisitor.
 */
class TerminalPipelineToELKVisitor{
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
      label: tree.title,
      model: { 
        resourceType: tree.resourceType,  
        tagName: tree.tagName
      }
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
 * Class MutltiPathToELKVisitor.
 */
class MutltiPathToELKVisitor{
  /**
   * Convert a dsl tree to g6 Graph data.
   * @param {object} visitor - The dsl tree visitor.
   * @param {object} tree - The dsl tree.
   * @param {function} filterFn - The dsl filterFn function.
   * @param {string} type - The dsl type. 
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
      }
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
          label: node.title,
          model: {
            resourceType: node.resourceType,   
            tagName: type+'.terminal'
          }
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
      }
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

/**
 * Class FlowToELKVisitor.
 */
export function* idGenFn(prefix,index) {
  while (index >= 0) {
    yield prefix+index;
    index++;
  }
}

let iconRegex = new RegExp("start|finish|loop|skip");
export function isIconFn (n) {
  return (n && n.model && iconRegex.test(n.model.tagName));
}

export function isContainer (n) {
  return (n.children && n.children != null && n.children.length > 0) || 
  (n && n.model && n.model.compound === true);
}
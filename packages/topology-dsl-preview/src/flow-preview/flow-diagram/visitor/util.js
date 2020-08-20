
/**
 * Class FlowToELKVisitor.
 */
export function* idGenFn(prefix,index) {
  while (index >= 0) {
    yield prefix+index;
    index++;
  }
}

export function isIconFn (n) {
  return (n && n.model && n.model.tagName === "mark");
}

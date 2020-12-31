
/**
 * Class FlowToELKVisitor.
 */
export function* idGenFn(prefix, index) {
  while (index >= 0) {
    yield prefix + index;
    index++;
  }
}

export function isIconFn(n) {
  return (n && n.model && n.model.tagName === 'mark');
}

export function isDefaultResourceFn(n) {
  return (n && n.model && n.model.resourceType === 'default');
}

// Reset ids
export function resetIds(obj, idx) {
  if (obj.id) {
    // Append a suffix
    obj.id = obj.id + '_' + idx;

    if (obj._start !== null) {
      obj._start.id = obj._start.id + '_' + idx;
    }
    if (obj._finish !== null) {
      obj._finish.id = obj._finish.id + '_' + idx;
    }
  }
  return obj;
}

// Clone and reset ids
export function clone(obj, idx) {
  if (obj === undefined || obj === null) {
    return obj;
  }
  let copy = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
  // Deep copy
  if (copy.compound) {
    if (Array.isArray(copy.elts)) {
      copy.elts = copy.elts.map((elt) => {
        return clone(elt, idx);
      });
    }
  }

  if (copy._start !== null) {
    copy._start = clone(copy._start, idx);
  }
  if (copy._finish !== null) {
    copy._finish = clone(copy._finish, idx);
  }

  return resetIds(copy, idx);
}
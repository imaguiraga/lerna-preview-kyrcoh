import {
  DslToELKGenerator
} from './elk-diagram-generator.js';

const elkGenerator = new DslToELKGenerator();

export function toElkGraph(dslObject) {
  let elkgraph = null;
  try {
    // dslObject to elkgraph
    elkgraph = elkGenerator.toElkGraph(dslObject);
  } catch (e) {
    console.error(e);
  }
  return elkgraph;
}
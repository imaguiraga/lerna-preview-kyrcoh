import './style/x6-elk-style.css';

import { createElkD3Renderer } from './d3-elk-renderer';
import { createElkX6Renderer } from './x6-elk-renderer';

export function createElkRenderer(_container_, _width_, _height_, _iconWidth_) {
  return createElkX6Renderer(_container_, _width_, _height_, _iconWidth_);
}

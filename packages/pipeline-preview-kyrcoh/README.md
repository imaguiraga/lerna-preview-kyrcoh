# pipeline-preview-kyrcoh
[Open in StackBlitz](https://stackblitz.com/github/imaguiraga/lerna-preview-kyrcoh/tree/master/packages/pipeline-preview-kyrcoh)

[Open in CodeSandBox](https://codesandbox.io/s/github/imaguiraga/lerna-preview-kyrcoh/tree/master/packages/pipeline-preview-kyrcoh)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/imaguiraga/lerna-preview-kyrcoh/tree/master/packages/pipeline-preview-kyrcoh)

A pipeline DSL javascript Visualizer using [antvis G6 Graph](https://g6.antv.vision/en)
and [CodeMirror](https://codemirror.net/) as text editor.

## Pipeline elements ##
- sequence(array)
```javascript
  sequence("a", "b", 
    repeat(optional("c")), 
    zeroOrMore("d")
  )
```  

- choice(array)
```javascript
  choice(
    terminal("a"),
    choice("e", "d")
  )
```  

- optional(pipelineElement)
```javascript
  optional("c")
```  

- repeat(pipelineElement)
```javascript
  repeat(optional("c"))
```  

- terminal(string)
  ```javascript
  terminal("b")
  ```

- zeroOrMore(pipelineElement)
  ```javascript
  zeroOrMore("d")
  ```


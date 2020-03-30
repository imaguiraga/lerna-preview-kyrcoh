# flow-preview-kyrcoh

[Open in CodeSandBox](https://codesandbox.io/s/imaguiraga/lerna-preview-kyrcoh/tree/master/flow-preview-kyrcoh)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/imaguiraga/lerna-preview-kyrcoh/tree/master/flow-preview-kyrcoh)

A flow DSL javascript Visualizer using [antvis G6 Graph](https://g6.antv.vision/en)
and [CodeMirror](https://codemirror.net/) as text editor.

## Flow elements ##
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

- optional(flowElement)
```javascript
  optional("c")
```  

- repeat(flowElement)
```javascript
  repeat(optional("c"))
```  

- terminal(string)
  ```javascript
  terminal("b")
  ```

- zeroOrMore(flowElement)
  ```javascript
  zeroOrMore("d")
  ```


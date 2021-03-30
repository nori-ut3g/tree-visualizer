# tree-visualizer

tree-visualizer can visualize tree structures(BST).


### input:
[1,-5,15,-9,-4,10,17,null,-6,null,0,null,14,16,19]

### output:
![test](https://nori-ut3g.github.io/tree-visualizer/pics/tree-vizualizer_sample_pic1.png)

See [demo](https://nori-ut3g.github.io/tree-visualizer/)


## Getting Started
### Prerequisites
tree-visualizer uses [anime.js](https://animejs.com/)

### Usage
Via npm
```
$ npm install treeVisualizer
```
```js
import treeVisualizer from "tree-visualizer/src/tree-visualizer.es.js";
```

Or link directly
```html
<script src="https://unpkg.com/tree-visualizer/src/tree-visualizer.js"></script>
<script src="https://unpkg.com/animejs@3.2.1/lib/anime.min.js"></script>
```

### Hello World
```html
<div id="targetDiv"></div>
```
```js
let targetFn = treeVisualizer(
    {target:"targetDiv"}
)
targetFn.drawData(
    [{
        data:"[1,-5,15,-9,-4,10,17,null,-6,null,0,null,14,16,19]"
    }]
)
```


## Author


mail to: nori.ut3g@mail.com

## License

"tree-visualizer" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License)

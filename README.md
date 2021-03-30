# tree-visualizer

tree-visualizer can visualize tree structures(BST).


### input:
[1,-5,15,-9,-4,10,17,null,-6,null,0,null,14,16,19]

### output:
![samplePic](https://nori-ut3g.github.io/tree-visualizer/pics/tree-vizualizer_sample_pic1.png)

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
import treeVisualizer from "./node_modules/tree-visualizer/src/tree-visualizer.es.js";
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

### Option
#### Set ID
Use unique ID, if there are same data in the tree.
```js
let targetFn = treeVisualizer(
    {target:"targetDiv"}
)
targetFn.drawData(
    [{
        data:"[1,1,1,1]",
        ID:"[0,1,2,3]"
    }]
)
```

#### Set Information
If you want the text to be displayed along with the animation, you can write the following
```js
let targetFn = treeVisualizer(
    {target:"targetDiv"}
)
targetFn.drawData(
    [{
        data:"[1,-5,15,-9,-4,10,17,null,-6,null,0,null,14,16,19]"
    }],`<strong>You can write html here</strong>`
)
```

#### Animation
Use nextStep, if you want to use animation.
tree-visualizer animates the difference.
```js
let targetFn = treeVisualizer(
    {target:"targetDiv"}
)
targetFn.drawData(
    [{
        data:"[1,-5,15,-9,-4,10,17,null,-6,null,0,null,14,16,19]"
    }],`1st step`
)
targetFn.nextStep(
    [{
        data:"[1,-5,15,-9,-4,10,17,null,-6,8,0,null,14,16,19]"
    }],`2nd step`
)
```
#### Animation Settings
You can change configuration.
```js
let targetFn = treeVisualizer(
    {   target : "targetDiv",
        boxColor :'rgb(233,203,107)',//default:'rgb(233,203,107)'
        textColor : 'rgb(69,54,10)',//Only rgb() default:'rgb(69,54,10)'
        arrowColor : 'rgb(153,103,49)',//Only rgb() default: 'rgb(153,103,49)'
        interval : 2000,// ms default: 2000
        boxSize : 30,// px default:30
        boxXMargin: 30,// px default 30
        boxYMargin: 45,// px default 45
    }
)
targetFn.drawData(
    [{
        data:"[1,-5,15,-9,-4,10,17,null,-6,null,0,null,14,16,19]"
    }],`1st step`
)
targetFn.nextStep(
    [{
        data:"[1,-5,15,-9,-4,10,17,null,-6,8,0,null,14,16,19]"
    }],`2nd step`
)
```
#### Node Settings
You can change the color for each node.
By using nextStep, you can animate the color change as well.
```js
let targetFn = treeVisualizer(
    {target:"targetDiv"}
)
targetFn.drawData(
    [{
        data:"[1,2,3,4]",
        boxColor:"[rgb(0,97,59),rgb(0,97,59),rgb(0,97,59),rgb(0,97,59)]",
        textColor:"[rgb(255,255,0),rgb(255,0,0),rgb(255,0,0),rgb(255,0,0)]"
    }]
)
```

#### Separate Tree
You can also display multiple trees.
```js
let targetFn = treeVisualizer(
    {target:"targetDiv"}
)
targetFn.drawData(
    [{
        data:"[1,2,3,4]"
    },
    {
        data:"[5,6,7,8]"
    }
    ]
)
```

## Author


mail to: nori.ut3g@gmail.com

## License

"tree-visualizer" is under [MIT license](https://en.wikipedia.org/wiki/MIT_License)

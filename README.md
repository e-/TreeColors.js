[![Build Status](https://travis-ci.org/e-/TreeColors.js.svg?branch=master)](https://travis-ci.org/e-/TreeColors.js)

# TreeColors.js

> A javascript implementation of the color scheme proposed in the paper "TreeColors: Color Schemes for Tree-Structured Data" by [Martijn Tennekes](https://github.com/mtennekes) and [Edwin de Jonge](https://github.com/edwindj)

## Install

Download the repository and include the script in your web page:

```html
<script src="TreeColors.js" type="text/javascript"></script>
```

You can also install it using [npm](https://www.npmjs.com/package/treecolors)

```
npm install treecolors
```

and load the library into your code:

```js
var TreeColors = require('treecolors');
```

## Usage

We have two color schemes: `additive` and `subtractive`. You can choose one of them by passing the name of it.

```js
var additive = TreeColors('add'),
    subtractive = TreeColors('sub');
```

Suppose we have a tree structure which looks like this:

```js
var tree = 
{
  name: "root",
  children: [
    {
      name: "child1"
    },
    {
      name: "child2"
    }
  ]
};
```

Note that each node has its children as an array with a key `children`. This is quite similar to the hierarchical structure used in [d3.js](http://d3js.org/).

You can color the tree by calling the color scheme as a function:

```js
additive(tree); // color the tree with the additive color scheme
subtractive(tree); // color the tree with the subtractive color scheme
```

Then, the color scheme adds a field (named `color` by default) to each node. 

```js
additive(tree);
console.log(tree.color); // { h: 0, c: 0, l: 70 }
console.log(tree.children[0].color); // { h: 90, c: 65, l: 60 }
```

Note that we are using the HCL color space rather than the RGB color space. This is because the HCL color space is more balanced than the RGB color space in terms of human perception.  For more information, please refer to [the original paper](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=6875961&tag=1) or this webpage([http://hclwizard.org/why-hcl/](http://hclwizard.org/why-hcl/)).

Unfortunately, modern web browsers do not support the HCL color space. Therefore, you need to convert HCL color values to RGB color values. If you are using d3.js, it is super easy:

```js
var rootColor = tree.color;

console.log(d3.hcl(rootColor.h, rootColor.c, rootColor.l));
```

If you want to paint d3's hierarchical visualizations such as treemaps, radial trees, or sunburst layout, first assign colors to the nodes:

```js
var additive = TreeColors('add');
additive(tree);
```

and paint all the nodes:

```js
d3.selectAll('.node rect') // `rect` for treemaps. If you are using different layout, you may change it to `path` or `circle`.
  .attr('fill', function(d){return d3.hcl(d.color.h, d.color.c, d.color.l);})
```

If you are interested in integrating TreeColors with d3.js, please see [this demo](http://e-.github.io/TreeColors.js/demo/).

## Options

will be documented soon.

## License

MIT © [Jaemin Jo](http://www.jaeminjo.com)

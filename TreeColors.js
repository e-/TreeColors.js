(function(){
  'use strict';
  var ep = 1e-15;

  function TreeColors(preset) {
    var children = 'children',
        color = 'color',
        range = [0, 360],
        fraction = 0.75,
        permutate = true,
        reverse = true,
        luminanceStart = 70,
        luminanceDelta = -10,
        chromaStart = 60,
        chromaDelta = 5,
        rootColor = {h: 0, c: 0, l: 70}
        ;

    function getChildren(node) {
      if(typeof children === 'string') {
        return node[children];
      } else {
        return children.call(node);
      }
      throw new Error('Cannot get the children of a node! Please set the \'children\' property properly.');
    }

    function setColor(node, c) {
      if(typeof color === 'string') {
        node[color] = c;
        return;
      } else {
        color.call(node, c);
        return;
      }
      throw new Error('Cannot set the color of a node! Please set the \'color\' property properly.');
    }

    function doPermutation(r) {
      var n = r.length,
          sequence = TreeColors.getPermutationSequence(n),
          permutated = new Array(n);

      r.forEach(function(value, index) {
        permutated[sequence[index]] = value;
      });

      return permutated;
    }

    function assignHue(node, range, level) {
      // select the middle hue value in range as the hue value of node
      if(level === 0) { // node is the root
        setColor(node, rootColor);
      } else {
        setColor(node, {h: (range[0] + range[1]) / 2, c: chromaStart + chromaDelta * level, l: luminanceStart + luminanceDelta * level});
      }

      // Let N be the number of child nodes of v. If N > 0 :
      var n = getChildren(node) ? getChildren(node).length : 0;

      if(n === 0) return;

      var delta = (range[1] - range[0]) / n;

      //1. divide range in N equal parts ri with i = 1, ... ,N;
      //   For convenience, we will use i = 0, ... , n - 1 instead of i = 1, ..., n
      var r = Array.apply(null, {length: n}).map(Number.call, Number);

      //2. if perm then permute the ri’s;
      if(permutate) {
        r = doPermutation(r);
      }

      //3. convert each ri to a hue range (e.g. [30, 50])

      r = r.map(function(i) { return [
        range[0] + i * delta,
        range[0] + (i + 1) * delta
      ]; });


      //4. reduce each ri by keeping its middle fraction ;
      //   In the algorithm described in the paper, we reverse each ri first.
      //   However, now, we reverse them later.

      r = r.map(function(range) { return [
        range[0] + (range[1] - range[0]) * ((1 - fraction) / 2),
        range[1] - (range[1] - range[0]) * ((1 - fraction) / 2)
      ]; });

      //5. if rev then reverse the even-numbered ri’s;
      if(reverse) {
        r = r.map(function(range, i) {
          if(i % 2 === 0) {
            return [range[1], range[0]];
          }
          return range;
        });
      }

      //6. for each child node vi call assignHue recursively.

      getChildren(node).forEach(function(child, i){
        assignHue(child, r[i], level + 1);
      });
    }

    function treeColor(root) {
      assignHue(root, range, 0);
    }

    treeColor.children = function(value) {
      if(!arguments.length) return children;
      children = value;
      return treeColor;
    };

    treeColor.color = function(value){
      if(!arguments.length) return color;
      color = value;
      return treeColor;
    };

    treeColor.range = function(value) {
      if(!arguments.length) return range;
      range = value;
      return treeColor;
    };

    treeColor.fraction = function(value) {
      if(!arguments.length) return fraction;
      fraction = value;
      return treeColor;
    };

    treeColor.permutate = function(value) {
      if(!arguments.length) return permutate;
      permutate = value;
      return treeColor;
    };

    treeColor.reverse = function(value) {
      if(!arguments.length) return reverse;
      reverse = value;
      return treeColor;
    };

    treeColor.luminance = function(value) {
      if(!arguments.length) return [luminanceStart, luminanceDelta];
      luminanceStart = value[0];
      luminanceDelta = value[1];
      return treeColor;
    };

    treeColor.luminanceStart = function(value) {
      if(!arguments.length) return luminanceStart;
      luminanceStart = value;
      return treeColor;
    };

    treeColor.luminanceDelta = function(value) {
      if(!arguments.length) return luminanceDelta;
      luminanceDelta = value;
      return treeColor;
    };

    treeColor.chroma = function(value) {
      if(!arguments.length) return [chromaStart, chromaDelta];
      chromaStart = value[0];
      chromaDelta = value[1];
      return treeColor;
    };

    treeColor.chromaStart = function(value) {
      if(!arguments.length) return chromaStart;
      chromaStart = value;
      return treeColor;
    };

    treeColor.chromaDelta = function(value) {
      if(!arguments.length) return chromaDelta;
      chromaDelta = value;
      return treeColor;
    };

    treeColor.rootColor = function(value) {
      if(!arguments.length) return rootColor;
      rootColor = value;
      return treeColor;
    };

    switch(preset) {
      case 'add':
      case 'additive':
        // nothing to do. additive is the default
        break;
      case 'sub':
      case 'subtractive':
        luminanceStart = 40;
        luminanceDelta = 10;
        chromaStart = 75;
        chromaDelta = -5;
        break;
    }

    return treeColor;
  }

  TreeColors.getPermutationSequence = function(n){
    if(n === 0) return [];
    if(n === 1) return [0];
    if(n === 2) return [0, 1];
    if(n === 3) return [0, 2, 1];
    if(n === 4) return [0, 2, 1, 3];

    // 144 is not a magic number. It is because the used permutation order is based on five-elements-permutation.
    var unitAngle = 360 / n,
        pickingAngle = Math.floor(144 / unitAngle) * unitAngle,
        sequence = new Array(n),
        picked = new Array(n),
        angle = 0
        ;

    for(var i = 0; i < n; ++i){
      var index = Math.floor(angle / unitAngle + ep);

      sequence[i] = index;
      picked[index] = true;

      angle = (angle + pickingAngle) % 360;

      if(i < n - 1) {
        while(picked[Math.floor(angle / unitAngle + ep)]) {
          angle = (angle + unitAngle) % 360;
        }
      }
    }

    return sequence;
  };


  if (typeof define === 'function' && define.amd) {
    define(function() {
      return TreeColors;
    });
  } else if (typeof module !== 'undefined') {
    module.exports = TreeColors;
  } else {
    window.TreeColors = TreeColors;
  }
})();

(function(){
  'use strict';

  /*
    nodes: nodes
    range: hue range, e.g) [0, 180], [180, 120]
    frac: hue fraction (0 <= f <= 1)
    perm: boolean permutation flag
    rev: boolean reverse flag
  */

  function permutate(r){
    var n = r.length;

    if(n <= 2) return r;
    if(n === 3) return [0, 2, 1];
    if(n === 4) return [0, 2, 1, 3];

    // 144 is not a magic number. It because the used permutation order is based on five-elements-permutation.
    var unitAngle = 360 / n,
        pickingAngle = Math.floor(144 / unitAngle) * unitAngle,
        permutated = new Array(n),
        picked = new Array(n),
        angle = 0
        ;

    for(var i = 0; i < n; ++i){
      var index = Math.floor(angle / unitAngle);

      permutated[i] = r[index];
      picked[index] = true;

      angle = (angle + pickingAngle) % 360;

      if(i < n - 1) {
        while(picked[Math.floor(angle / unitAngle)]) {
          angle = (angle + unitAngle) % 360;
        }
      }
    }

    return permutated;
  }

  function test(n){
    var arr = Array.apply(null, {length: n}).map(Number.call, Number);
    arr = permutate(arr);
    console.log(arr.map(function(t){return String.fromCharCode(65 + t);}));
  }

  for(var i = 3; i<=12;++i) {
    test(i);
  }

  function assignHue(nodes, range, frac, perm, rev) {
    // Let N be the number of child nodes of v. If N > 0 :
    var n = nodes.length;

    if(n === 0) return;

    var delta = (range[1] - range[0]) / n;

    //1. divide range in N equal parts ri with i = 1, ... ,N;
    //   For convenience, we will use i = 0, ... , n - 1 instead of i = 1, ..., n
    var r = Array.apply(null, {length: n}).map(Number.call, Number);

    //2. if perm then permute the ri’s;
    if(perm) {
      r = permutate(r);
    }

    //3. convert each ri to a hue range (e.g. [30, 50])

    r = r.map(function(i) { return [
      range[0] + i * delta,
      range[0] + (i + 1) * delta
    ]; });


    //4. reduce each ri by keeping its middle fraction f ;
    //   In the algorithm described in the paper, we reverse each ri first.
    //   However, now, we reverse them later.

    r = r.map(function(range) { return [
      range[0] + (range[1] - range[0]) * (f / 2),
      range[1] - (range[1] - range[0]) * (f / 2)
    ] });

    //5. if rev then reverse the even-numbered ri’s;
    if(rev) {
    }

    //5. for each child node vi DO AssignHue(vi, ri, f , perm, rev).

  }

  function TreeColors() {
    function treeColor() {

    }
  }

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

/*define(['d3'], function(){
  d3.treeColor = function(){
    var hueRange = [0, 360];

    function permutate(ranges){
      var n = ranges.length,
          m = Math.ceil(Math.sqrt(n)),
          arr = new Array(n * n);

      ranges.forEach(function(range, i){
        var row = Math.floor(i / m),
            col = i % m;

        arr[col * m + row] = range;
      });

      return arr.filter(function(range){return range;});
    }

    function assignColors(data, range){
      data.color = d3.hcl((range[0] + range[1]) / 2, 55 - 5 * data.level, 65 + 10 * data.level);

      if(data.level == 0)
        data.color = d3.hcl(0, 0, 80);

      if(!data.children) return;

      var
          n = data.children.length,
          delta = (range[1] - range[0]) / n,
          padding = delta > 0 ? .25 : -.25,
          ranges = []
          ;
      d3.range(n).forEach(function(i){
        r
        nges.push([range[0] + delta * i + padding * delta, range[0] + delta * (i + 1) - padding * delta]);
      });
      ranges = permutate(ranges);
      data.children.forEach(function(child, i){
        assignColors(child, (i % 2 == 0 ? ranges[i] : [ranges[i][1], ranges[i][0]]));
      });
    }

    function treeColor(data){
      assignColors(data, hueRange);
    }

    return treeColor;
  };
});*/

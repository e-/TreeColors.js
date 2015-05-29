'use strict';
var treeColors = require('../TreeColors');

exports.TreeColorsTest = function(test){
  function check1(sequence){
    var n = sequence.length, h = {};
    for(var i = 0; i < n; ++i) {
      if(h[sequence[i]]) return false;
      h[sequence[i]] = true;
    }
    return true;
  }

  function check2(sequence){
    var n = sequence.length;
    for(var i = 0; i < n; ++i) {
      if(sequence[i] < 0 || sequence[i] >= n) {
        return false;
      }
    }
    return true;
  }

  for(var n = 1; n <= 1000; ++n) {
    var sequence = treeColors.getPermutationSequence(n);

    // sequence must contain all integers from 1 to n once.
    test.ok(sequence.length === n, "Permutation for " + n + " failed! The sequence has length " + sequence.length + ".");
    test.ok(check1(sequence), "Permutation for " + n + " failed! The sequence has duplicate numbers");
    test.ok(check2(sequence), "Permutation for " + n + " failed! The sequence has wrong values");
  }

  test.done();
};

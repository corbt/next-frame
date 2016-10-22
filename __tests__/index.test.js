'use strict';

var nextFrame = require('../index');

it('nextFrame', function() {
  var result = 1;
  return nextFrame().then(() => {
    expect(result).toBe(1);
  });
});

it('nextFrame.mapInFrames', function() {
  return nextFrame.mapInFrames([1, 2, 3], val => val * 2).then(
    results => expect(results).toEqual([2, 4, 6])
  );
});

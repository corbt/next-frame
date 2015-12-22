
/* Returns a promise that will resolve on the next AnimationFrame */
function nextFrame() {
  return new Promise(function(resolve, reject) {
    requestAnimationFrame(function() { resolve(); });
  });
}

/* Applies `fn` to each element of `collection`, iterating once per frame */
nextFrame.mapInFrames = function(collection, fn) {
  var results = [];

  return new Promise(function(resolve, reject) {
    var processEntry = function(index) {
      if (index < collection.length) {
        requestAnimationFrame(function() {
          try {
            results.push(fn(collection[index]));
            processEntry(index+1);
          } catch(e) {
            reject(e);
          }
        })
      }
      else {
        resolve(results);
      }
    };

    processEntry(0);
  });
}

module.exports = nextFrame;
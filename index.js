
/* Returns a promise that will resolve on the next AnimationFrame */
function nextFrame() {
  return new Promise(function(resolve, reject) {
    requestAnimationFrame(function() { resolve(); });
  });
}

module.exports = nextFrame;
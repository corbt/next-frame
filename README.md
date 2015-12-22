# Introduction

'next-frame' is a small tool intended to make it easier to create performant UIs in [React Native](https://facebook.github.io/react-native/). You can read more about the rationale behind it in the [blog post introducing it](https://corbt.com/posts/2015/12/22/breaking-up-heavy-processing-in-react-native.html).

React Native and Javascript don't give us access to background threads without writing native code. This means that every computation we execute should ideally take less than 1/60th of a second so it doesn't interfere with animation performance or percieved responsiveness.

Some computations inevitably take longer than this. When they do, React Native gives you a couple of options:

  1. Port the operation to native code and run it in the background.
  2. Use the [`InteractionManager`](https://facebook.github.io/react-native/docs/interactionmanager.html#content) to run it after animations.

`'next-frame'` is designed to be a third option. It allows you to break up an expensive computation into smaller parts and run just part of it on each repaint. This maintains the responsiveness of your UI while the computation is still ongoing.

# Quick Start

This quick start assumes that you're already familiar with the `async` and `await` keywords, which you can read up on [here](https://medium.com/the-exponent-log/react-native-meets-async-functions-3e6f81111173#.6yek596lu). Async and await are enabled by default in current versions of React Native, so this pattern works in RN out of the box.

```javascript
import nextFrame from 'next-frame';

let response = await fetch("https://emberall.com/user/1/recordings");
let responseJSON = await response.json();

for (let recording of responseJSON.recordings) {
  await nextFrame(); // The javascript will yield here and not resume execution until the next frame.
  mergeRecordingToLocalDatabase(recording);
}
```

For the previous example, let's assume that we get several hundred recordings back from the server as an array, and each one takes about 1/100th of a second to process. Normally processing all of them would take several seconds, and would cause unacceptable lag. However, using `await nextFrame()` we break up our computation and have much better perceived responsiveness.

## mapInFrames

In the common case (like the one in the example above) that you just want to iterate over a collection and process one element per frame, we've included a convenience function `mapInFrames` that does exactly that. Here's the same example, rewritten with `mapInFrames`:

```javascript
import { mapInFrames } from 'next-frame';

let response = await fetch("https://emberall.com/user/1/recordings");
let recordingsJSON = await response.json();

await mapInFrames(recordingJSON, mergeRecordingToLocalDatabase);
```

Easy, and not imperative at all. :smiley:

# Under the hood

`next-frame` is extremely simple (check out index.js if you don't believe me). It simply wraps Javascript's [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) in a Promise.

# Other Uses

This library was developed with React Native in mind and has only been tested there. However, it should work fine in the browser as well.

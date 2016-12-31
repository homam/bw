const R = require('ramda')

const sounds = [
    ['wrong', '/sfx/wrong.mp3']
  , ['error', '/sfx/error.mp3']
  , ['right', '/sfx/right.mp3']
  , ['beep', '/sfx/beep.mp3']
]

module.exports = R.pipe(
    R.map(([name, src]) => [name, new Howl({src: [src]})])
  , R.fromPairs
)(sounds)

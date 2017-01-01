// @flow

const R = require('ramda')

const waitPromise = <T>(time : number, p : Promise<T>) : Promise<T> => new Promise((resolve, reject) => {
  let timedOut = false
  let cont = null
  let result;
  const check = () => {
    if(timedOut && !!cont) {
      cont(result)
    }
  }
  setTimeout(() => {
    timedOut = true
    check()
  }, time)
  p.then(r => {
    cont = resolve
    result = r
    check()
  })
  p.catch(r => {
    cont = reject
    result = r
    check()
  })
})

const wait = (t: number, f : () => any = () => null) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(f()), t)
})

const waitSeq = (ts: Array<number>, fs: Array<() => any>)=>
  R.map(([t, f])=> {
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(f()), t)
    })
  })
  (R.zip(ts, fs))


module.exports = {
    waitPromise
  , wait
  , waitSeq
}

const Promise = require('bluebird')
const R = require('ramda')

const pEachSequence = (f, xs)=> Promise.reduce(xs, (_, x)=> f(x), 0)


const pMemoize = (f)=> {
    const cache = {}

    return (...args)=> {
        const key = JSON.stringify(args)
        const valueInCache = R.prop(key, cache)

        return new Promise((resolve, reject)=> {
            if (!!valueInCache) {
                resolve(valueInCache)
            } else {
                f(args)
                .then((d)=> {
                    cache[`${key}`] = d
                    return resolve(d)
                })
                .catch(reject)
            }
        })
    }
}


const preloadImages = (images: Array<string>)=>
    R.map((x)=> (new Image()).src = x)(images)


module.exports.pEachSequence = R.curry(pEachSequence)
module.exports.pMemoize = pMemoize
module.exports.preloadImages = preloadImages

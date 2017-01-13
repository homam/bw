// @flow

const axios = require('axios')
const R = require('ramda')
const {contestApi, quizApi, answerApi, registrationApi, pinVerificationApi, subscriptionApi, profileApi} = require('../config')
import type {QuizPayload, AnswerPayload, PinPayload, ContestItem, QuestionItem, OptionItem, Answer, RegistrationPayload, SubscriptionPayload, Profile} from "../../types.js"
const {pMemoize} = require('./utils')
const cookie = require('react-cookie')


const getAccessToken = ()=> cookie.load('access_token')


const calculateHash = (payloadString: string): string => {
    const algString = "alg=HS256,typ=JWT"
    const clientSecreteString = "yAu6XJthJo959BAWVWeCQXBsUM196gpc"

    //Create base 64 hash of each string and combine it to create a hash
    const alg = new Buffer(algString).toString('base64')
    const payload = new Buffer(payloadString).toString('base64')
    const clientSecrete = new Buffer(clientSecreteString).toString('base64')

    return alg + payload + clientSecrete
}


const constructPayloadString = (payload: Object): string=>
    R.reduce(
        (cur, [k, v])=> {
            if (!cur)
                return `${k}=${v}`
            else
                return `${cur},${k}=${v}`
        }
        , ''
    )(R.toPairs(payload)) + ','


const apiRequest = (url: string, authKey: string, hash: string, payload: Object): Promise<Object> =>
    axios({
        method: 'post'
        , url: url
        , headers: {
            'hash': hash
            , 'Authorization': `Bearer ${authKey}`
            , 'alg': 'HS256'
            , 'typ': 'JWT'
        }
        , data: payload
    })


const getContestList = (url: string, authKey: string): Promise<Array<ContestItem>> => new Promise((resolve, reject)=>

    axios({
        method: 'get'
        , url: url
        , headers: {
            'Authorization': `Bearer ${authKey}`
        }
    })
    .then(({data})=> {
        const contestList = R.compose(
            R.values
            , R.prop('data')
        )(data)

        resolve(contestList)
    })
    .catch(reject)
)


const getContestQuiz = (url: string, authKey: string, contestId: number, questionNumber: number): Promise<QuestionItem> => {

    const payload = {
        contest_id: contestId
        , options_limit: 12
        , question_number: questionNumber
    }

    const hash = R.compose(calculateHash, constructPayloadString)(payload)

    return new Promise((resolve, reject)=>
        apiRequest(url, authKey, hash, payload)
        .then(({data})=> {

            const question: QuestionItem = R.compose(
                (item)=> {
                    return {
                        ...item
                        , options: R.compose(
                            R.prop('Options')
                            , JSON.parse
                            , R.prop('options')
                        )(item)
                    }
                }
                , R.prop('data')
            )(data)

            resolve(question)
        })
        .catch(reject)
    )
}


const answerQuiz = (url: string, authKey: string, contestId: number, questionId: number, questionNumber: number, answer: string): Promise<Answer> => {

    const payload = {
        contest_id: contestId
        , question_id: questionId
        , question_number: questionNumber
        , answer: answer
    }

    const hash = R.compose(calculateHash, constructPayloadString)(payload)

    return new Promise((resolve, reject)=>
        apiRequest(url, authKey, hash, payload)
        .then(({data})=>
            resolve(R.prop('data')(data))
        )
        .catch((err)=> reject(err))
    )
}


const registration = (url: string, authKey: string, msisdn: string, contestId: number, publisherId: string)=> {

    const payload = {
        msisdn: msisdn
        , contest_id: contestId
        , publisherid: publisherId
    }

    const hash = R.compose(calculateHash, constructPayloadString)(payload)

    return new Promise((resolve, reject)=> {
        apiRequest(url, authKey, hash, payload)
        .then(({data})=>
            resolve(R.prop('data')(data))
        )
        .catch(({response})=> {
            return reject(response.data)
        })
    })
}


const subscription = (url: string, authKey: string, contestId: number, publisherId: string)=> {

    const payload = {
        contest_id: contestId
        , publisherid: publisherId
    }

    const hash = R.compose(calculateHash, constructPayloadString)(payload)

    return new Promise((resolve, reject)=> {
        apiRequest(url, authKey, hash, payload)
        .then(({data})=>
            resolve(R.prop('data')(data))
        )
        .catch(({response})=> {
            return reject(response.data)
        })
    })
}


const pinVerification = (url: string, authKey: string, msisdn: string, contestId: number, pincode: number)=> {

    const payload = {
        msisdn: msisdn
        , contest_id: contestId
        , pincode: pincode
    }

    const hash = R.compose(calculateHash, constructPayloadString)(payload)

    return new Promise((resolve, reject)=> {
        apiRequest(url, authKey, hash, payload)
        .then(({data})=>
            resolve(R.prop('data')(data))
        )
        .catch(({response})=> {
            return reject(response.data)
        })
    })
}


const getProfile = (url: string, authKey: string): Promise<Profile> => new Promise((resolve, reject)=>

    axios({
        method: 'get'
        , url: url
        , headers: {
            'Authorization': `Bearer ${authKey}`
        }
    })
    .then(({data})=> {
        const profile = R.compose(
            R.prop('data')
        )(data)

        resolve(profile)
    })
    .catch(reject)
)


const updateProfile = (url: string, authKey: string, first_name: string)=> {

    const payload = {
        first_name: first_name
    }

    const hash = R.compose(calculateHash, constructPayloadString)(payload)

    return new Promise((resolve, reject)=> {
        apiRequest(url, authKey, hash, payload)
        .then(({data})=>
            resolve(R.prop('data')(data))
        )
        .catch(({response})=> {
            return reject(response.data)
        })
    })
}


const callApi = (f)=> f(getAccessToken())


module.exports.getContestList = pMemoize(()=> callApi(R.curry(getContestList)(contestApi)))
module.exports.getContestQuiz = (...args)=> callApi(R.curry(getContestQuiz)(quizApi))(...args)
module.exports.answerQuiz = (...args)=> callApi(R.curry(answerQuiz)(answerApi))(...args)
module.exports.registration = (...args)=> callApi(R.curry(registration)(registrationApi))(...args)
module.exports.pinVerification = (...args)=> callApi(R.curry(pinVerification)(pinVerificationApi))(...args)
module.exports.subscription = (...args)=> callApi(R.curry(subscription)(subscriptionApi))(...args)
module.exports.getProfile = ()=> callApi(R.curry(getProfile)(profileApi))
module.exports.updateProfile = (...args)=> callApi(R.curry(updateProfile)(profileApi))(...args)

// @flow

const axios = require('axios')
const R = require('ramda')
const {contestApi, quizApi, answerApi, imagePath, registrationApi, pinVerificationApi, subscriptionApi} = require('../config')
import type {QuizPayload, AnswerPayload, PinPayload, ContestItem, QuestionItem, OptionItem, Answer, RegistrationPayload, SubscriptionPayload} from "../../types.js"
const {pMemoize} = require('./utils')
const cookie = require('react-cookie')

const authKey = cookie.load('access_token')

const calculateHash = (payloadString: string): string => {
    const algString = "alg=HS256,typ=JWT"
    const clientSecreteString = "DUhMrFggWqa47mJ54m2YLLVqRJ23KRJZ"

    //Create base 64 hash of each string and combine it to create a hash
    const alg = new Buffer(algString).toString('base64')
    const payload = new Buffer(payloadString).toString('base64')
    const clientSecrete = new Buffer(clientSecreteString).toString('base64')

    return alg + payload + clientSecrete
}


const constructContestItem = (item: Object): ContestItem => {
    const {contest_id, name, best_time, contest_image, time_remaining, unlocked} = item

    return {
        contest_id: contest_id
        , name
        , best_time: best_time
        , contest_image: `${imagePath}${contest_image}`
        , time_remaining: time_remaining
        , unlocked: unlocked
    }
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


const apiRequest = (url: string, authKey: string, hash: string, payload: QuizPayload | AnswerPayload | RegistrationPayload | PinPayload | SubscriptionPayload): Promise<Object> =>
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
            R.map(constructContestItem)
            , R.values
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


module.exports.getContestList = pMemoize(()=> getContestList(contestApi, authKey))
module.exports.getContestQuiz = R.curry(getContestQuiz)(quizApi, authKey)
module.exports.answerQuiz = R.curry(answerQuiz)(answerApi, authKey)
module.exports.registration = R.curry(registration)(registrationApi, authKey)
module.exports.pinVerification = R.curry(pinVerification)(pinVerificationApi, authKey)
module.exports.subscription = R.curry(subscription)(subscriptionApi, authKey)

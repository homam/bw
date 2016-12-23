// @flow

const axios = require('axios')
const R = require('ramda')
const {authKey, contestApi, quizApi, answerApi} = require('../config')
import type {QuizPayload, AnswerPayload} from "../../types.js";


const calculateHash = (payloadString: string): string => {
    const algString = "alg=HS256,typ=JWT"
    const clientSecreteString = "bByTRDA8CL7BYr82BCK2s4yJPhvR4cy5"

    //Create base 64 hash of each string and combine it to create a hash
    const alg = new Buffer(algString).toString('base64')
    const payload = new Buffer(payloadString).toString('base64')
    const clientSecrete = new Buffer(clientSecreteString).toString('base64')

    return alg + payload + clientSecrete
}


const constructQuizPayloadString = (contestID: number, i: number): string =>
    `contest_id=${contestID},options_limit=1,question_number=${i},`


const constructAnswerPayloadString = (contestID: number, quesId: number, currentQ: number, answer: string): string=>
    `contest_id=${contestID},question_id=${quesId},question_number=${currentQ},answer=${answer},`


const apiRequest = (url: string, authKey: string, hash: string, payload: QuizPayload | AnswerPayload): Promise<Object> =>
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


const getContestList = (url: string, authKey: string): Promise<Object> => axios({
    method: 'get'
    , url: url
    , headers: {
        'Authorization': `Bearer ${authKey}`
    }
})


const getContestQuiz = (url: string, authKey: string, contestId: number, questionNumber: number): Promise<Object> => {

    const hash = R.compose(calculateHash, constructQuizPayloadString)(contestId, questionNumber)

    const payload = {
        contest_id: contestId
        , options_limit: 1
        , question_number: questionNumber
    }

    return apiRequest(url, authKey, hash, payload)
}


const answerQuiz = (url: string, authKey: string, contestId: number, questionId: number, questionNumber: number, answer: string): Promise<Object> => {

    const hash = R.compose(calculateHash, constructAnswerPayloadString)(contestId, questionId, questionNumber, answer)

    const payload = {
        contest_id: contestId
        , question_id: questionId
        , question_number: questionNumber
        , answer: answer
    }

    return apiRequest(url, authKey, hash, payload)
}


// getContestQuiz(quizApi, authKey, 174, 0)
// .then((d)=> console.log(d))
// .catch((e)=> console.log(e))

module.exports.getContestList = ()=> getContestList(contestApi, authKey)
module.exports.getContestQuiz = R.curry(getContestList)(contestApi, authKey)
module.exports.answerQuiz = R.curry(getContestList)(contestApi, authKey)

// getContestList(contestApi, authKey)
// .then(({data})=> console.log(R.values(data.data)))
// .catch((e)=> console.log(e))

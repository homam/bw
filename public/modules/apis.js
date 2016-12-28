// @flow

const axios = require('axios')
const R = require('ramda')
const {authKey, contestApi, quizApi, answerApi, imagePath} = require('../config')
import type {QuizPayload, AnswerPayload, ContestItem, QuestionItem, OptionItem, Answer} from "../../types.js"


const calculateHash = (payloadString: string): string => {
    const algString = "alg=HS256,typ=JWT"
    const clientSecreteString = "bByTRDA8CL7BYr82BCK2s4yJPhvR4cy5"

    //Create base 64 hash of each string and combine it to create a hash
    const alg = new Buffer(algString).toString('base64')
    const payload = new Buffer(payloadString).toString('base64')
    const clientSecrete = new Buffer(clientSecreteString).toString('base64')

    return alg + payload + clientSecrete
}


const constructContestItem = (item: Object): ContestItem => {
    const {contest_id, name, best_time, contest_image, time_remaining} = item

    return {
        contest_id: contest_id
        , name
        , best_time: best_time
        , contest_image: `${imagePath}${contest_image}`
        , time_remaining: time_remaining
    }
}


const constructQuizPayloadString = (contestID: number, i: number): string =>
    `contest_id=${contestID},options_limit=12,question_number=${i},`


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

    const hash = R.compose(calculateHash, constructQuizPayloadString)(contestId, questionNumber)

    const payload = {
        contest_id: contestId
        , options_limit: 12
        , question_number: questionNumber
    }

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

    const hash = R.compose(calculateHash, constructAnswerPayloadString)(contestId, questionId, questionNumber, answer)

    const payload = {
        contest_id: contestId
        , question_id: questionId
        , question_number: questionNumber
        , answer: answer
    }

    return new Promise((resolve, reject)=>
        apiRequest(url, authKey, hash, payload)
        .then(({data})=>
            resolve(R.prop('data')(data))
        )
        .catch((err)=> reject(err))
    )
}


module.exports.getContestList = ()=> getContestList(contestApi, authKey)
module.exports.getContestQuiz = R.curry(getContestQuiz)(quizApi, authKey)
module.exports.answerQuiz = R.curry(answerQuiz)(answerApi, authKey)

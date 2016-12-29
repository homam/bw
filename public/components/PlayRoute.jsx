 // @flow

const React = require('react')
const R = require('ramda')
const moment = require('moment')
const {getContestQuiz, answerQuiz, getContestList} = require('../modules/apis')
import type {QuestionItem} from "../../types.js";

const ContestInfo = require('./ContestInfo.jsx')
const Question = require('./Question.jsx')


module.exports = React.createClass({

    displayName: 'play-route'

    , render() {

        const currentQuestion = (R.isEmpty(this.state.questions)) ? [] : [R.last(this.state.questions)]
        const prevQuestions = R.init(this.state.questions)

        const QuestionElem = R.map((currentQuestion)=> {
            const questionNumber = currentQuestion.question_number
            const totalQuestions = currentQuestion.total_questions

            const {option_type, options, title, question_id, _status} = currentQuestion

            return (<Question
                key={question_id}
                optionType={option_type}
                options={options}
                title={title}
                questionNumber={questionNumber}
                totalQuestions={totalQuestions}
                status={_status}
                onAnswer={(title)=> {

                    answerQuiz(this.state.contestId, question_id, questionNumber, title)
                    .then(({answer_result, is_completed})=> {

                        if (is_completed) {
                            window.location.href = `/#/contest/${this.state.contestId}/congrats`
                        } else {
                            // update status of the current question (answer was correct ot wrong)
                            this.setState({
                                questions: R.append(
                                    {...currentQuestion, _status: {answered: true, correct: answer_result == "correct", answer: title}}
                                    , prevQuestions
                                )
                            })

                            // if answer was correct, load the next question
                            if (answer_result == "correct") {
                                getContestQuiz(this.state.contestId, questionNumber + 1)
                                .then((question)=> {

                                    const newQuestion = {...question, _status: {answered: false}}
                                    this.setState({questions: R.append(newQuestion, this.state.questions)})
                                })
                            } else {
                                // add penalty seconds
                                this.setState({penaltyMs: this.state.penaltyMs + 1000})
                            }
                        }

                    })
                }}
            />)
        })(currentQuestion)

        const ContestInfoElem = R.compose(
            R.map((contestItem)=> {
                return (<ContestInfo
                    key={contestItem.contest_id}
                    contestItem={contestItem}
                    startTime={this.state.startTime}
                    penaltyMs={this.state.penaltyMs}
                />)
            })
            , R.filter((contestItem)=> contestItem.contest_id == this.state.contestId)
        )(this.state.contestList)


        return (<div className="play-route">
            {ContestInfoElem}
            {QuestionElem}
        </div>)
    }

    , getInitialState()  {

        const {contestId} = this.props.routeParams

        const initialState: {
            contestId: number
            , questions: Array<QuestionItem>
            , startTime: number
            , contestList: Array<ContestItem>
            , penaltyMs: number
        } = {
            contestId: parseInt(contestId)
            , questions: []
            , startTime: Date.now()
            , contestList: []
            , penaltyMs: 0
        }

        return initialState
    }

    , componentDidMount() {

        getContestList()
        .then((contestList)=> {
            this.setState({contestList: contestList})
        })

        getContestQuiz(this.state.contestId, 0)
        .then((question)=> {

            const newQuestion = {...question, _status: {answered: false}}
            this.setState({questions: R.append(newQuestion, this.state.questions)})
        })

    }
})

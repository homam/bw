 // @flow

const React = require('react')
const R = require('ramda')
const moment = require('moment')
const {getContestQuiz, answerQuiz, getContestList} = require('../modules/apis')
const {waitPromise, wait, waitSeq} = require('../modules/async')
import type {QuestionItem} from "../../types.js";

const ContestInfo = require('./ContestInfo.jsx')
const Question = require('./Question.jsx')
const Penalty = require('./Penalty.jsx')
const PlayCountdown = require('./PlayCountdown.jsx')
const Congrats = require('./Congrats.jsx')
const sfx = require('../modules/sfx')
const {pEachSequence} = require('../modules/utils')

const vibrateDevice = (ms: number)=> {
    if (!!navigator.vibrate)
        navigator.vibrate(ms)
}

const playCountdownFrom = 4

module.exports = React.createClass({

    displayName: 'play-route'

    , render() {

        const currentQuestion = (R.isEmpty(this.state.questions)) ? [] : [this.state.questions[this.state.currentQuestionIndex]]
        const prevQuestions = R.take(this.state.currentQuestionIndex, this.state.questions)

        //TODO: why is it a map?
        //TODO: logic has to change, render the next few questions, keep them hidden (to cache their images)
        // find currentQuestionIndex and show the question at the this.state.currentQuestionIndex
        const QuestionElemCache = R.map((currentQuestion)=> {
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
                    // update status of the current question tapped
                    this.setState({
                        questions: R.map((questionItem)=> {
                            if (questionItem.question_number == questionNumber)
                                return {...questionItem, _status: {tapped: true, answer: title}}
                            else
                                return questionItem
                        })(this.state.questions)
                    })

                    answerQuiz(this.state.contestId, question_id, questionNumber, title)
                    .then(({answer_result, is_completed})=> {

                        if (is_completed) {
                            waitSeq(
                                [200, 1000, 1200]
                                , [
                                    () => this.setState({transitioning: true})
                                    , () => this.setState({completed: true})
                                    , () => this.setState({transitioning: false})
                                ]
                            )
                        } else {
                            this.setState({
                                questions: R.map((questionItem)=> {
                                    if (questionItem.question_number == questionNumber)
                                        return {...questionItem, _status: {tapped: true, answered: true, isCorrect: answer_result == "correct", answer: title}}
                                    else
                                        return questionItem
                                })(this.state.questions)
                            })

                            // if answer was correct, load the next question
                            if (answer_result == "correct") {
                                // code for sequencing UI effects
                                sfx.right.play()

                                wait(200, () => this.setState({transitioning: true}))

                                // if all questions have already beeen pre loaded
                                if (R.length(this.state.questions) == currentQuestion.total_questions) {
                                    wait(1000, ()=> this.setState({transitioning: false, currentQuestionIndex: this.state.currentQuestionIndex + 1}))
                                } else {
                                    waitPromise(1000,
                                        getContestQuiz(this.state.contestId, R.length(this.state.questions))
                                        .then((question)=> {
                                            // this code runs immediately (in order to cache the photos for the next quiz)
                                            // but the parent primise returns after 700ms
                                            const newQuestion = {...question, _status: {answered: false}}
                                            this.setState({
                                                questions: R.append(newQuestion, this.state.questions)
                                            })
                                        })
                                    ).then(() => {
                                        // show next question
                                        this.setState({transitioning: false, currentQuestionIndex: this.state.currentQuestionIndex + 1})
                                    })
                                }
                            } else {
                                // add penalty seconds
                                sfx.wrong.play()
                                this.setState({penaltyMs: this.state.penaltyMs + 1000})
                                this.showPenalty()

                                vibrateDevice(500)

                                // resetting tapped and shake classes in Question.jsx options
                                setTimeout(() => {
                                    this.setState({
                                        questions: R.map((questionItem)=> {
                                            if (questionItem.question_number == questionNumber)
                                                return {...questionItem, _status: {tapped: false, answered: false, isCorrect: null, answer: title}}
                                            else
                                                return questionItem
                                        })(this.state.questions)
                                    })
                                }, 1500);
                            }
                        }

                    })
                }}
            />)
        })(this.state.questions)

        const QuestionElem = QuestionElemCache[this.state.currentQuestionIndex]

        const ContestInfoElem = R.compose(
            R.map((contestItem)=> {
                return (<ContestInfo
                    key={contestItem.contest_id}
                    contestItem={contestItem}
                    startTime={this.state.startTime}
                    penaltyMs={this.state.penaltyMs}
                    completed={this.state.completed}
                />)
            })
            , R.filter((contestItem)=> contestItem.contest_id == this.state.contestId)
        )(this.state.contestList)

        return (<div className={"play-route" + (this.state.showTimer ? ' show-timer' : '') + (this.state.transitioning ? ' transitioning' : '') + (this.state.showPenalty ? ' show-penalty' : '')}>
            <div className='blocker' onMouseDown={ () => sfx.error.play() } /> {/* used to disable interaction during the shake, penalty animation*/}
            {ContestInfoElem}
            <div className='play-route-content'>
              {this.state.showTimer ? <PlayCountdown from={playCountdownFrom} /> : ''}
              {this.state.completed ? <Congrats /> : QuestionElem}
            </div>
            <div className={'penalty ' + (this.state.showPenalty ? 'in' : '')}>
                <Penalty />
            </div>
        </div>)
    }

    , getInitialState()  {

        const {contestId} = this.props.routeParams

        const initialState: {
            contestId: number
            , questions: Array<QuestionItem>
            , startTime: number
            //TODO: state must be a single ContestItem
            , contestList: Array<ContestItem>
            , penaltyMs: number
            , showPenalty: boolean
            , showTimer: boolean
            , transitioning: boolean
            , currentQuestionIndex: number
            , completed: boolean
        } = {
            contestId: parseInt(contestId)
            , questions: []
            , startTime: Date.now()
            , contestList: []
            , penaltyMs: 0
            , showPenalty: false
            , showTimer: true
            , transitioning: false
            , currentQuestionIndex: 0
            , completed: false
        }

        return initialState
    }

    , _initTimer: null

    , componentDidMount() {

        this._initTimer = window.setTimeout(() => {
            this.setState({showTimer: false})
        }, (playCountdownFrom + 1) * 1000)

        getContestList()
        .then((contestList)=> {
            this.setState({contestList: contestList})
        })

        // preload questions
        pEachSequence((questionNumber)=> {
            return getContestQuiz(this.state.contestId, questionNumber)
            .then((question)=> {
                const newQuestion = {...question, _status: {answered: false}}
                this.setState({questions: R.append(newQuestion, this.state.questions)})
            })
        })(R.range(0, 2))
    }
    , componentWillUnmount() {
        window.clearTimeout(this._initTimer)
    }

    , showPenalty() {
        this.setState({showPenalty: true})

        setTimeout(()=> this.setState({showPenalty: false}), 1400)
    }
})

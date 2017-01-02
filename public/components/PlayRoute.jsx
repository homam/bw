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
const playCountdownFrom = 4
const sfx = require('../modules/sfx')

const loadAllQuizzes = (contestId: number) : Promise<[QuestionItem]> => {
  const loadNextQuiz = (acc : Array<QuestionItem>, questionNumber: number) =>
    getContestQuiz(contestId, questionNumber).then(question => {
        const newQuestion = {...question, _status: {answered: false, isCorrect: null, answer: null}}
        return newQuestion
    }).then(q => {
      if(q.total_questions > questionNumber + 1)
        return loadNextQuiz(acc.concat([q]), questionNumber + 1)
      else return acc
    })

  return loadNextQuiz([], 0)
}

const vibrateDevice = (ms: number)=> {
    if (!!navigator.vibrate)
        navigator.vibrate(ms)
}

export default class PlayRouteContainer extends React.Component {
  state: {
      showTimer: bool
    , transitioning: bool
    , showPenalty: bool
    , contestId: number
    , contest: ?Object
    , startTime : number
    , penaltyMs : number
    , completed : boolean
    , questions: QuestionItem[]
    , currentQuestionIndex: number
  }

  _initTimer: ?number

  constructor(props : Object) {
    super(props);
    this.state = {
        showTimer: true
      , transitioning: false
      , showPenalty: false
      , contestId: (parseInt(props.routeParams.contestId) : number)
      , contest: (null : ?Object)
      , startTime : 0
      , penaltyMs : 0
      , completed : false
      , questions: ([] : QuestionItem[])
      , currentQuestionIndex: (-1 : number)
    };

    this._initTimer = null

    getContestList().then(contestList => {
      this.setState({contest: R.find(contestItem =>
        contestItem.contest_id == this.state.contestId, contestList)})
    })

    loadAllQuizzes(this.state.contestId).then((questions) => {
      this.setState({questions})
      this.nextQuestion()
    })

  }

  nextQuestion() {
    const currentQuestionIndex = this.state.currentQuestionIndex + 1
    this.setState({currentQuestionIndex})
  }

  componentWillMount() {
    this._initTimer = window.setTimeout(() => {
        this.setState({showTimer: false})
    }, (playCountdownFrom + 1) * 1000)
  }

  componentWillUnmount() {
    window.clearTimeout(this._initTimer)
  }

  render() {
    // TODO: render questions 2 by 2
    var questionElement;
    if (this.state.currentQuestionIndex > -1) {
      questionElement = R.pipe(
          R.drop(this.state.currentQuestionIndex)
        , R.take(2)
      )(this.state.questions).map(currentQuestion => {
      // const currentQuestion = this.state.questions[this.state.currentQuestionIndex]
        const {option_type, options, title, question_id, _status, question_number, total_questions} = currentQuestion

        return <Question
            key={question_id}
            optionType={option_type}
            options={options}
            title={title}
            questionNumber={question_number}
            totalQuestions={total_questions}
            status={_status}
            onAnswer={(title)=> {}} />
        })
    } else {
      questionElement = null
    }

    return <div className={"play-route" + (this.state.showTimer ? ' show-timer' : '') + (this.state.transitioning ? ' transitioning' : '') + (this.state.showPenalty ? ' show-penalty' : '')}>
      <ContestInfo
          key={this.state.contestId}
          contestItem={this.state.contest}
          startTime={this.state.startTime}
          penaltyMs={this.state.penaltyMs}
          completed={this.state.completed}
      />
      <div className='play-route-content'>
        {questionElement}
      </div>
    </div>
  }
}

// old code
var old = React.createClass({

    displayName: 'play-route'

    , render() {


        const currentQuestion = (R.isEmpty(this.state.questions)) ? [] : [this.state.questions[this.state.currentQuestionIndex]]
        const prevQuestions = R.init(this.state.questions)

        //TODO: why is it a map?
        //TODO: logic has to change, render the next few questions, keep them hidden (to cache their images)
        // find currentQuestionIndex and show the question at the this.state.currentQuestionIndex
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

                    // update status of the current question tapped
                    this.setState({
                        questions: R.append(
                            {...currentQuestion, _status: {tapped: true, answer: title}}
                            , prevQuestions
                        )
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
                            // update status of the current question (answer was correct or wrong)
                            this.setState({
                                questions: R.append(
                                    {...currentQuestion, _status: {tapped: true, answered: true, isCorrect: answer_result == "correct", answer: title}}
                                    , prevQuestions
                                )
                            })

                            // if answer was correct, load the next question
                            if (answer_result == "correct") {
                                // code for sequencing UI effects
                                sfx.right.play()
                                wait(200, () => this.setState({transitioning: true}))
                                waitPromise(1000,
                                  getContestQuiz(this.state.contestId, questionNumber + 1)
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
                            } else {
                                // add penalty seconds
                                sfx.wrong.play()
                                this.setState({penaltyMs: this.state.penaltyMs + 1000})
                                this.showPenalty()

                                vibrateDevice(500)

                                // resetting tapped and shake classes in Question.jsx options
                                setTimeout(() => {
                                  this.setState({
                                      questions: R.append(
                                          {...currentQuestion, _status: {tapped: false, answered: false, isCorrect: null, answer: title}}
                                          , prevQuestions
                                      )
                                  })
                                }, 1500);
                            }
                        }

                    })
                }}
            />)
        })(currentQuestion)


        return (<div className={"play-route" + (this.state.showTimer ? ' show-timer' : '') + (this.state.transitioning ? ' transitioning' : '') + (this.state.showPenalty ? ' show-penalty' : '')}>
            <div className='blocker' onMouseDown={ () => sfx.error.play() } /> {/* used to disable interaction during the shake, penalty animation*/}
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
            , contestList: Array<mixed>
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

        getContestQuiz(this.state.contestId, 0)
        .then((question)=> {

            const newQuestion = {...question, _status: {answered: false}}
            this.setState({questions: R.append(newQuestion, this.state.questions)})
        })

    }
    , componentWillUnmount() {
        window.clearTimeout(this._initTimer)
    }

    , showPenalty() {
        this.setState({showPenalty: true})

        setTimeout(()=> this.setState({showPenalty: false}), 1400)
    }
})

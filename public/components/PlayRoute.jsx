 // @flow

const React = require('react')
const R = require('ramda')
const moment = require('moment')
const cookie = require('react-cookie')
const {getContestQuiz, answerQuiz, getContestList} = require('../modules/apis')
const {waitPromise, wait, waitSeq} = require('../modules/async')
import type {QuestionItem} from "../../types.js";

const ContestInfo = require('./ContestInfo.jsx')
const Question = require('./Question.jsx')
const Penalty = require('./Penalty.jsx')
const PlayCountdown = require('./PlayCountdown.jsx')
const Congrats = require('./Congrats.jsx')
const ProgressBar = require('./ProgressBar.jsx')
const playCountdownFrom = 4
const sfx = require('../modules/sfx')
const {preloadImages} = require('../modules/utils')

const calculateProgress = (currentQuestion: number, totalQuestions: number): number =>
    currentQuestion * 100 / totalQuestions

const loadAllQuizzes = (contestId: number) : Promise<[QuestionItem]> => {
  const loadNextQuiz = (acc : Array<QuestionItem>, questionNumber: number) =>
    getContestQuiz(contestId, questionNumber).then(question => {
      const newQuestion = {...question, _status: {answered: false, isCorrect: null, answer: null, tapped: false}}
      return newQuestion
    }).then(q => {
      if(q.total_questions > questionNumber + 1)
        return loadNextQuiz(acc.concat([q]), questionNumber + 1)
      else return acc.concat([q])
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
    , elapsed: ?number
  }

  _initTimer: ?number

  constructor(props : Object) {
    super(props);
    this.state = {
        showTimer: true
      , transitioning: false
      , showPenalty: false
      , contestId: (parseInt(props.params.contestId) : number)
      , contest: (null : ?Object)
      , startTime : (new Date().valueOf() : number)
      , penaltyMs : 0
      , completed : false
      , questions: ([] : QuestionItem[])
      , currentQuestionIndex: (-1 : number)
      , elapsed: (null : ?Object)
    };

    this._initTimer = null

    getContestList(cookie.load('access_token')).then(contestList => {
      this.setState({contest: R.find(contestItem =>
        contestItem.contest_id == this.state.contestId, contestList)})
    })

    loadAllQuizzes(this.state.contestId).then(questions => {
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

  showPenalty() {
      this.setState({showPenalty: true})

      setTimeout(() => this.setState({showPenalty: false}), 1400)
  }

  answer(title : string) {

    // update status of the current question tapped
    let currentQuestion = this.state.questions[this.state.currentQuestionIndex]

    const selectedOption = R.find((x)=> x.title == title)(currentQuestion.options)

    // ignore the tap on previously selected wrong option
    if (selectedOption._status && selectedOption._status.answered)
        return false

    const updateQuestion_status = status => {

        const updatedQuestion = {
            ...currentQuestion,
            _status: {...currentQuestion._status, ...status},
            options: R.map((option)=> {
                if (option.title == status.answer && status.answered) {
                    return {...option, _status: status}
                } else {
                    return option
                }
            })(currentQuestion.options)
        }

        let questions = this.state.questions
        questions[this.state.currentQuestionIndex] = updatedQuestion
        this.setState({questions})
    }

    updateQuestion_status({tapped: true, answer: title, answered: false, isCorrect: null})

    answerQuiz(this.state.contestId, currentQuestion.question_id, currentQuestion.question_number, title)
    .then(({answer_result, is_completed, fastest_player, result_message})=> {

        // result_message represents time it took the user to finish the quiz as string
        this.setState({elapsed: parseInt(result_message)})

        // update status of the current question (answer was correct or wrong)
        updateQuestion_status({tapped: true, answer: title, answered: true, isCorrect: answer_result == "correct"})

        // if answer was correct, load the next question
        if (answer_result == "correct") {

            // preload image
            if (currentQuestion.question_number + 2 == currentQuestion.total_questions) {
                preloadImages(['/img/congrats.png'])
            }

            // code for sequencing UI effects
            sfx.right.play()
            //TODO: handle is_completed
            wait(200, () => this.setState({transitioning: true}))
            wait(1000, () =>
              is_completed ? waitSeq(
                  [200, 1000, 1200]
                , [
                    () => this.setState({transitioning: true})
                  , () => this.setState({completed: true})
                  , () => this.setState({transitioning: false})
                ]
              )
            : this.setState({transitioning: false, currentQuestionIndex: this.state.currentQuestionIndex + 1})
          )

        } else {
            // add penalty seconds
            sfx.wrong.play()
            this.setState({penaltyMs: this.state.penaltyMs + 1000})
            this.showPenalty()
            vibrateDevice(500)
            // resetting tapped and shake classes in Question.jsx options
            // wait(1500, () => updateQuestion_status({tapped: false, answer: title, answered: false, isCorrect: null}))
        }

    })
  }

  render() {

    const nextTwoQuestions = R.pipe(
        R.drop(this.state.currentQuestionIndex)
      , R.take(2)
    )(this.state.questions)

    var questionElements;
    if (this.state.currentQuestionIndex > -1) {
      questionElements = nextTwoQuestions.map(currentQuestion => {
        const {option_type, options, title, question_id, _status, question_number, total_questions} = currentQuestion

        return <Question
            key={question_id}
            optionType={option_type}
            options={options}
            title={title}
            questionNumber={question_number}
            totalQuestions={total_questions}
            status={_status}
            onAnswer={title => this.answer(title)} />
        })
    } else {
      questionElements = null
    }



    const progress = this.state.completed ? 100 : nextTwoQuestions.length == 0 ? 0 : calculateProgress(nextTwoQuestions[0].question_number, nextTwoQuestions[0].total_questions)

    return <div className={"play-route" + (this.state.showTimer ? ' show-timer' : '') + (this.state.transitioning ? ' transitioning' : '') + (this.state.showPenalty ? ' show-penalty' : '')}>
      <div className={'penalty ' + (this.state.showPenalty ? 'in' : '')}>
        <Penalty />
      </div>
      <ContestInfo
          key={this.state.contestId}
          contestItem={this.state.contest}
          startTime={this.state.startTime}
          penaltyMs={this.state.penaltyMs}
          completed={this.state.completed}
          elapsed={this.state.elapsed}
      />
      <div className='play-route-content'>
        <div className='blocker' onMouseDown={ () => sfx.error.play() } /> {/* used to disable interaction during the shake, penalty animation*/}
        <div className="level-info">Level 1</div>
        <ProgressBar progress={progress} />
        {this.state.showTimer ? <PlayCountdown from={playCountdownFrom} /> : ''}
        {this.state.completed ? <Congrats /> : <div className='questions'>{questionElements}</div>}
      </div>
    </div>
  }
}

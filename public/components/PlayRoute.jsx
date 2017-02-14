 // @flow

const React = require('react')
const R = require('ramda')
const moment = require('moment')
const cookie = require('react-cookie')
const {getContestQuiz, answerQuiz, getContestList} = require('../modules/apis')
const {waitPromise, wait, waitSeq} = require('../modules/async')
import type {QuestionItem, LevelItem, TimerState, ContestItem} from "../../types.js"

const ContestInfo = require('./ContestInfo.jsx')
const Question = require('./Question.jsx')
const Penalty = require('./Penalty.jsx')
const PlayCountdown = require('./PlayCountdown.jsx')
const Congrats = require('./Congrats.jsx')
const ProgressBar = require('./ProgressBar.jsx')
const BulletBar = require('./BulletBar.jsx')
const LevelComplete = require('./LevelComplete.jsx')
const LevelTimeout = require('./LevelTimeout.jsx')
const sfx = require('../modules/sfx')
const {preloadImages, preloadImagesP} = require('../modules/utils')
const playCountdownFrom = 4


const calculateProgress = (currentQuestion: number, totalQuestions: number): number =>
    currentQuestion * 100 / totalQuestions


const vibrateDevice = (ms: number)=> {
    if (!!navigator.vibrate)
        navigator.vibrate(ms)
}

export default class PlayRouteContainer extends React.Component {
    state: {
        transitioning: bool
        , showPenalty: bool
        , contestId: number
        , contest: ?ContestItem
        , levels: Array<LevelItem>
        , currentLevelIndex: number
        , currentQuestionIndex: number
        , levelTimeAvailable: ?number
        , timerState: TimerState
        , currentState: 'countdown' | 'question' | 'level_timeout' | 'level_complete' | 'congrats'
        , showLoading: boolean
    }

    _initTimer: ?number

    constructor(props : Object) {
        super(props)
        this.state = {
            transitioning: false
            , showPenalty: false
            , contestId: (parseInt(props.params.contestId) : number)
            , contest: (null : ?ContestItem)
            , levels: ([] : LevelItem[])
            , currentLevelIndex: 0
            , currentQuestionIndex: (-1 : number)
            , levelTimeAvailable: (null: ?number)
            , timerState: (null: TimerState)
            , currentState: 'countdown'
            , showLoading: false
        };

        this._initTimer = null
    }

    nextQuestion() {
        const currentQuestionIndex = this.state.currentQuestionIndex + 1
        this.setState({currentQuestionIndex})
    }

    componentWillMount() {
        this._initTimer = window.setTimeout(() => {
            this.setState({currentState: 'question'})
        }, (playCountdownFrom + 1) * 1000)
    }

    extractOptionImages(questions: Array<QuestionItem>) {
        return R.compose(
            R.map(({title})=> title),
            R.flatten,
            R.map(({options})=> options)
        )(questions)
    }

    // if replace is true, the current level from the state will be replaced with a new one
    // so the user stays on the same level, but the questions change
    loadContestLevel(contestId: number, levelIndex: number, replace: boolean = false) {
        return new Promise((resolve, reject)=> {
            getContestQuiz(contestId, levelIndex).then(level => {
                const newLevel = {...level, questions: R.map((it)=> {
                    return {...it, _status: {answered: false, isCorrect: null, answer: null, tapped: false}}
                })(level.questions)}

                // divided into 2 sets so can preload the first question images before preloading the rest
                const initialQuestion = R.head(level.questions)
                const restQuestion = R.tail(level.questions)

                // preload only the images of the first question
                R.compose(
                    preloadImagesP,
                    this.extractOptionImages
                )([initialQuestion])
                // use "finally" instead of "then" so if any image fails to load, we still render the rest
                .finally(()=> {
                    // images are preloaded, render the state
                    const currentLevels = replace ? R.filter((it)=> it.level != levelIndex)(this.state.levels) : this.state.levels
                    this.setState({levels: R.append(newLevel, currentLevels), levelTimeAvailable: newLevel.level_time_available})
                    resolve()

                    // preload rest of the question images in background
                    R.compose(
                        preloadImages,
                        this.extractOptionImages
                    )(restQuestion)
                })
            })
        })
    }

    componentDidMount() {
        getContestList(cookie.load('access_token')).then(contestList => {
            this.setState({
                contest: R.find(contestItem => contestItem.contest_id == this.state.contestId, contestList)
            })
        })

        this.loadContestLevel(this.state.contestId, 1).then(()=> {
            this.nextQuestion()
        })
    }

    componentWillUnmount() {
        window.clearTimeout(this._initTimer)
    }

    showPenalty() {
        this.setState({showPenalty: true})
        setTimeout(() => this.setState({showPenalty: false}), 1400)
    }

    nextLevel() {
        this.setState({showLoading: true})
        this.loadContestLevel(this.state.contestId, this.state.currentLevelIndex + 2)
        .then(()=> {
            this.setState({
                timerState: 'restart'
                , transitioning: false
                , currentLevelIndex: this.state.currentLevelIndex + 1
                , currentQuestionIndex: 0
                , currentState: 'question'
                , showLoading: false
            })
        })
    }

    retryLevel() {
        this.setState({showLoading: true})
        // don't preload the quiz, load only when user clicks the retry button, since
        // the time counting startes when the api is requested
        // if quiz preloaded, the counting will start even though user is still in the timeout page
        this.loadContestLevel(this.state.contestId, this.state.currentLevelIndex + 1, true)
        .then(()=> {
            this.setState({
                timerState: 'restart'
                , transitioning: false
                , currentLevelIndex: this.state.currentLevelIndex
                , currentQuestionIndex: 0
                , currentState: 'question'
                , showLoading: false
            })
        })
    }

    onTimeout() {
        this.setState({currentState: 'level_timeout', timerState: 'pause'})
        // this.loadContestLevel(this.state.contestId, this.state.currentLevelIndex + 1, true)
    }

    answer(title : string) {

        const currentLevel = this.state.levels[this.state.currentLevelIndex]

        // update status of the current question tapped
        let currentQuestion = currentLevel.questions[this.state.currentQuestionIndex]

        const selectedOption = R.find((x)=> x.title == title)(currentQuestion.options)

        // ignore the tap on previously selected wrong option
        if (selectedOption._status && selectedOption._status.answered)
            return false

        const updateQuestion_status = status => {

            const updatedQuestion = {
                ...currentQuestion,
                _status: {...currentQuestion._status, ...status},
                options: R.map((option)=> {
                    if (option.title == status.answer) {
                        return {...option, _status: status}
                    } else {
                        return option
                    }
                })(currentQuestion.options)
            }

            let levels = this.state.levels
            levels[this.state.currentLevelIndex].questions[this.state.currentQuestionIndex] = updatedQuestion

            this.setState({levels})
        }

        updateQuestion_status({tapped: true, answer: title, answered: false, isCorrect: null})

        answerQuiz(this.state.contestId, currentQuestion.question_id, this.state.currentLevelIndex + 1, title)
        .then(({is_contest_complete, is_correct, is_level_complete, total_time_elapsed, level_time_elapsed, level_time_available})=> {
            // this.onTimeout()
            // return
            // sync time with the server
            this.setState({
                levelTimeAvailable: level_time_available
                , timerState: is_level_complete ? 'pause' : this.state.timerState
            })

            // update status of the current question (answer was correct or wrong)
            updateQuestion_status({tapped: true, answer: title, answered: true, isCorrect: is_correct})

            if (is_correct) {

                // preload image
                if (this.state.currentQuestionIndex + 2 == currentLevel.total_questions && this.state.currentLevelIndex + 1 == currentLevel.total_levels) {
                    preloadImages(['/img/congrats.png'])
                }

                // preload next level
                // don't preload the quiz, since the time counting starts when the api is called
                // load the quiz when play button is clicked
                // if (is_level_complete && !is_contest_complete) {
                //     this.loadContestLevel(this.state.contestId, this.state.currentLevelIndex + 2)
                // }

                // code for sequencing UI effects
                sfx.right.play()
                //TODO: handle is_completed
                wait(200, () => this.setState({transitioning: true}))
                wait(1000, () =>
                  (is_contest_complete || is_level_complete) ? waitSeq(
                      [200, 1000, 1200]
                    , [
                        () => this.setState({transitioning: true})
                      , () => this.setState({currentState: (is_contest_complete ? 'congrats' : 'level_complete')})
                      , () => this.setState({transitioning: false})
                    ]
                  )
                : this.setState({transitioning: false, currentQuestionIndex: this.state.currentQuestionIndex + 1})
              )

            } else {
                // add penalty seconds
                sfx.wrong.play()
                this.showPenalty()
                vibrateDevice(500)
                // resetting tapped and shake classes in Question.jsx options
                // wait(1500, () => updateQuestion_status({tapped: false, answer: title, answered: false, isCorrect: null}))
            }

        })
    }

    render() {
        const currentLevel = this.state.levels[this.state.currentLevelIndex]

        var questionElements;
        if (this.state.currentQuestionIndex > -1 && currentLevel) {

            const {option_type, options, title, question_id, _status} = currentLevel.questions[this.state.currentQuestionIndex]

            questionElements = <Question
                key={question_id}
                optionType={option_type}
                options={options}
                title={title}
                status={_status}
                onAnswer={title => this.answer(title)} />
        } else {
            questionElements = null
        }

        // const progress = this.state.completed ? 100 : !this.state.currentLevelIndex ? 0 : calculateProgress(this.state.currentQuestionIndex, currentLevel.total_questions)
        const progressLevel = !!currentLevel ? calculateProgress((this.state.currentState == 'congrats' ? this.state.currentLevelIndex + 1 : this.state.currentLevelIndex), currentLevel.total_levels) : 0

        let currentStateElement = null
        switch (this.state.currentState) {
            case 'countdown':
                currentStateElement = <PlayCountdown from={playCountdownFrom} />
                break;
            case 'question':
                currentStateElement = <div className='questions'>{questionElements}</div>
                break;
            case 'level_complete':
                currentStateElement = <LevelComplete level={this.state.currentLevelIndex + 1} totalLevels={currentLevel.total_levels} onClick={()=> this.nextLevel()} loading={this.state.showLoading}/>
                break;
            case 'level_timeout':
                currentStateElement = <LevelTimeout level={this.state.currentLevelIndex + 1} onClick={()=> this.retryLevel()} loading={this.state.showLoading} />
                break;
            case 'congrats':
                currentStateElement = <Congrats contestId={this.state.contestId}/>
                break;
        }

        return (
            <div className={"play-route" + (this.state.currentState == 'countdown' ? ' show-timer' : '') + (this.state.transitioning ? ' transitioning' : '') + (this.state.showPenalty ? ' show-penalty' : '')}>
                <div className={'penalty ' + (this.state.showPenalty ? 'in' : '')}>
                    <Penalty />
                </div>
                <ContestInfo
                    key={this.state.contestId}
                    contestItem={this.state.contest}
                    timerState={this.state.timerState}
                    availableTime={this.state.levelTimeAvailable}
                    totalAvailableTime={!!currentLevel ? currentLevel.level_time_available : null}
                    currentLevel={this.state.currentLevelIndex + 1}
                    totalLevels={!!currentLevel ? currentLevel.total_levels : null}
                    onTimeout={()=> this.onTimeout()}
                />
                <div className='play-route-content'>
                    <div className='blocker' onMouseDown={ () => sfx.error.play() } /> {/* used to disable interaction during the shake, penalty animation*/}
                    {!R.contains(this.state.currentState, ['level_complete', 'level_timeout', 'countdown']) && currentLevel && (
                        <div>
                            <div className="level-info">Question {this.state.currentQuestionIndex + 1} of {currentLevel.total_questions}</div>
                            {/* <ProgressBar progress={progressLevel} /> */}
                        </div>
                    )}

                    {currentStateElement}
                </div>
            </div>
        )
    }
}

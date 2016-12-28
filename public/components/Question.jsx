// @flow

const React = require('react')
const R = require('ramda')
const {imagePath} = require('../config')

const ProgressBar = require('./ProgressBar.jsx')

const calculateProgress = (currentQuestion: number, totalQuestions: number): number =>
    currentQuestion * 100 / totalQuestions


module.exports = (props)=> {

    const {optionType, options, title, questionNumber, totalQuestions, status} = props
    const {answered, isCorrect, answer} = status

    const progress = calculateProgress(questionNumber + 1, totalQuestions)

    const Options = R.map(({title})=> {
        const src = `${imagePath}${title}`

        const shakeClass = (answered && !isCorrect && answer == title) ? "shake" : ""

        return (<div className={`option-container ${shakeClass}`} key={title}>
            {/*answered && answer == title && <div className="mark correct">X</div>*/}
            <img src={src} onClick={()=> props.onAnswer(title)}/>
        </div>)
    })(options)


    return (
        <div className="question-component">

            <div className="question-container">
                <div className="row">
                    <div className="small-12 columns level-info">Level 1</div>
                </div>
                <div className="row">
                    <div className="small-3 columns">&nbsp;</div>
                    <div className="small-6 columns">
                        <ProgressBar progress={progress} />
                    </div>
                    <div className="small-3 columns">&nbsp;</div>
                </div>
                <div className="row">
                    <div className="small-12 columns title">{title}</div>
                    <div className="small-12 columns options-row">{Options}</div>
                </div>
            </div>

        </div>
    )
}

// @flow

const React = require('react')
const R = require('ramda')
const {imagePath} = require('../config')

module.exports = (props)=> {

    const {optionType, options, title, status} = props
    
    const Options = R.map(({title, _status = {}})=> {
        const src = title

        // shake class depends on the status of the question object, since it contains the title of the lastest answer
        const shakeClass = (status.answer == title && status.answered && !status.isCorrect) ? "shake" : ""

        // for highligning correct or wrong answer, use the status of the options object, since it contains status per option
        const {answered, isCorrect, answer, tapped} = _status

        return (<div className={
          `option-container ${shakeClass} ${answer == title && answered && isCorrect ? 'right' : answer == title && answered ? 'wrong' : ''} ${answer == title && tapped ? 'tapped' : ''}`
        }
          style={{backgroundImage: `url('${src}')`}}
          onClick={()=> props.onAnswer(title)}
          key={title}>
            {answer == title && <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>}
            {/*answered && answer == title && <div className="mark correct">X</div>*/}
            {/* <img src={src} onClick={()=> props.onAnswer(title)}/> */}
        </div>)
    })(options)


    //TODO: move Level 1 and Prgoress ro PlayRoute
    //These elements should remain visible during transition from a question to next
    return (
        <div className="question-component">

            <div className="question-container">
                <div className="row">
                    <div className="small-12 columns title">{title}</div>
                    <div className="small-12 columns options-row">{Options}</div>
                </div>
            </div>

        </div>
    )
}

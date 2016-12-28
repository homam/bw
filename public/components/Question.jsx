const React = require('react')
const R = require('ramda')
const {imagePath} = require('../config')

module.exports = (props)=> {

    const {optionType, options, title, status} = props
    const {answered, isCorrect, answer} = status

    const Options = R.map(({title})=> {
        const src = `${imagePath}${title}`
        return (<div className="option-container" key={title}>
            {/*answered && answer == title && <div className="mark correct">X</div>*/}
            <img src={src} onClick={()=> props.onAnswer(title)}/>
        </div>)
    })(options)

    return (
        <div className="question-component">

            <div className="question-container">
                <div className="row">
                    <div className="small-12 columns">level N</div>
                    <div className="small-12 columns">progress bar</div>
                    <div className="small-12 columns title">{title}</div>
                    <div className="small-12 columns options-row">{Options}</div>
                </div>
            </div>

        </div>
    )
}

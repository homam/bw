const React = require('react')
const R = require('ramda')

module.exports = (props)=> {

    const {optionType, options, title} = props

    const Options = R.map(({title})=>
        <img key={title} src={title}/>
    )(options)

    return (
        <div className="question-component">

            <div className="question-container">
                <div className="row">
                    <div className="small-12 columns">level N</div>
                    <div className="small-12 columns">progress bar</div>
                    <div className="small-12 columns title">{title}</div>
                    <div className="small-12 columns">{Options}</div>
                </div>
            </div>

        </div>
    )
}

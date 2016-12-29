const React = require('react')

const Timer = require('./Timer.jsx')

module.exports = (props:{startTime: number})=> {

    return (
        <div className="contest-info-component">
            <div className="container">
                <Timer startTime={props.startTime}/>
            </div>
        </div>
    )
}

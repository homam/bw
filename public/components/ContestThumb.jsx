const React = require('react')

const Button = require('./Button.jsx')

module.exports = (props)=> {
    const {contestId, name, bestTime, contestImage, timeRemaining} = props

    return (
        <div className="contest-thumb">

            <div className="box">
                <img src={contestImage}/>
                {name}
                <Button />
            </div>

        </div>
    )
}

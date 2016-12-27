const React = require('react')
const {Link} = require('react-router')

const Button = require('./Button.jsx')

module.exports = (props)=> {
    const {contestId, name, bestTime, contestImage, timeRemaining} = props

    return (
        <div className="contest-thumb">

            <div className="box">
                <div className="row header">
                    <div className="small-12 columns"><img src={contestImage}/></div>
                    <div className="small-12 columns product-name">{name}</div>
                    <div className="small-12 columns">
                        <Link className="button" to={`/contest/${contestId}/play`}>Play Now</Link>
                    </div>
                </div>

                <div className="row">
                    <div className="small-6 columns">{bestTime}</div>
                    <div className="small-6 columns">LEADERBOARD</div>
                </div>
            </div>

        </div>
    )
}

const React = require('react')
const moment = require('moment')
const {Link} = require('react-router')

const Button = require('./Button.jsx')

module.exports = (props)=> {
    const {contestId, name, bestTime, contestImage, timeRemaining} = props
    const time = moment(bestTime || 0)

    return (
        <div className="contest-thumb">

            <div className="container">
                <div className="header">
                    <div className="row contest-info-container">
                        <div className="small-4 columns image-container"><img src={contestImage}/></div>
                        <div className="small-8 columns title">{name}</div>
                    </div>

                    <div className="row">
                        <div className="small-12 columns">
                            <Link className="button round" to={`/contest/${contestId}/play`}>Play Now</Link>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="small-6 columns">
                        <p>Best Time:</p>
                        <p>{time.format('mm: ss: SSS')}</p>
                    </div>
                    <div className="small-6 columns">
                        <p>LEADERBOARD</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

const React = require('react')
const moment = require('moment')
const {Link} = require('react-router')

const Button = require('./Button.jsx')

module.exports = (props)=> {
    const {contestId, name, bestTime, contestImage, timeRemaining} = props
    const time = moment(bestTime || 0)


    const daysLeft = moment(timeRemaining * 1000).diff((new Date()), 'days')

    return (
        <div className="contest-thumb">

            <div className="container">
                <div className="header">
                    <div className="contest-info-container">
                        <div className="image-container" style={{
                          backgroundImage: `url('${contestImage}')`
                        }} />
                        <div className="info">
                            <p className="title">{name}</p>
                            <p className="days-left">Ends in {daysLeft} days</p>
                        </div>
                    </div>

                    <Link className="button round" to={`/contest/${contestId}/play`}>Play Now</Link>

                </div>

                <div className="row">
                    <div className="small-6 columns">
                        <p className="time-title">Best Time:</p>
                        <p className="time-value">{time.format('mm: ss: SS')}</p>
                    </div>
                    <div className="small-6 columns">
                        <p className="leaderboard-title">LEADERBOARD &gt;</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

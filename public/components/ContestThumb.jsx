const React = require('react')
const moment = require('moment')
const {Link} = require('react-router')

const Button = require('./Button.jsx')

module.exports = (props:{contestId: number, name: string, bestTime: ?number, contestImage: string, timeRemaining: number, locked: boolean})=> {

    const {contestId, name, bestTime, contestImage, timeRemaining, locked, onClick} = props
    const time = moment(bestTime || 0)

    const daysLeft = moment(timeRemaining * 1000).diff((new Date()), 'days')

    return (
        <div className="contest-thumb">

            <div className={"container " + ((locked) ? "locked" : "")}>
                <div className="header">
                    <div className="contest-info-container">
                        <div className="image-container" style={{
                          backgroundImage: `url('${contestImage}')`
                        }}>
                            {locked && <img src="/img/icon-locked.png" />}
                        </div>
                        <div className="info">
                            <p className="title">{name}</p>
                            <p className="info">Ends in {daysLeft} days</p>
                        </div>
                    </div>

                    <a href="javascript:void(0)" onClick={() => onClick(contestId)} className="button round">Play Now</a>

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

// @flow

const React = require('react')
const moment = require('moment')
const {Link} = require('react-router')
import type {ContestItem} from "../../types.js";
const Button = require('./Button.jsx')
const Loading = require('./Loading.jsx')

module.exports = (props:{contestItem: ContestItem, loading: boolean, onClick: (contestItem: contestItem) => any})=> {

    const {contestItem, onClick, loading} = props
    const {contest_id, name, best_score, contest_image, time_remaining, unlocked} = contestItem
    const time = moment(best_score || 0)

    const daysLeft = moment(time_remaining * 1000).diff((new Date()), 'days')

    return (
        <div className="contest-thumb">

            <div className={"container " + ((unlocked) ? "" : "locked")}>
                <div className="header">
                    <div className="contest-info-container">
                        <div className="image-container" style={{
                          backgroundImage: `url('${contest_image}')`
                        }}>
                            {!unlocked && <img src="/img/icon-locked.png" />}
                        </div>
                        <div className="info">
                            <p className="title">{name}</p>
                            <p className="info">Ends in {daysLeft} days</p>
                        </div>
                    </div>

                    <a href="javascript:void(0)" onClick={() => onClick(contestItem)} className="button round">
                    {loading ? <Loading /> : 'Play Now'}
                    </a>

                </div>

                <div className="row">
                    <div className="small-6 columns">
                        <p className="time-title">Best Time:</p>
                        <p className="time-value">{time.format('mm: ss: SS')}</p>
                    </div>
                    <div className="small-6 columns">
                        <Link to={`leaderboard/${contest_id}`} className="leaderboard-title">LEADERBOARD &gt;</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

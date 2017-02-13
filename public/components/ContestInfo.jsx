// @flow

const React = require('react')
import type {ContestItem, TimerState} from "../../types.js"

import Timer from './Timer.jsx'

module.exports = (props:{contestItem: ?ContestItem, timerState: TimerState, availableTime: ?number, currentLevel: ?number, totalLevels: ?number, totalAvailableTime: ?number, onTimeout: ()=> any})=> {

    const {timerState, contestItem, availableTime, currentLevel, totalLevels, totalAvailableTime, onTimeout} = props

    return (
        <div className="contest-info-component">
            <div className="row contest-info">
                <div className="contest-image" style={!contestItem ? {} : {backgroundImage: `url('${contestItem.contest_image}')`}}>
                    {!contestItem ? '' : contestItem.name}
                </div>
                <div className="level-number">Level {currentLevel} of {totalLevels}</div>
            </div>
            <div className="row timer">
                <Timer state={timerState} availableTime={availableTime} totalAvailableTime={totalAvailableTime} onTimeout={onTimeout}/>
            </div>
        </div>)
}

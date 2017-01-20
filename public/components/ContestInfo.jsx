// @flow

const React = require('react')
import type {ContestItem, TimerState} from "../../types.js"

import Timer from './Timer.jsx'

module.exports = (props:{contestItem: ?ContestItem, timerState: TimerState, elapsed: ?number, availableTime: ?number, onTimeout: ()=> any})=> {

    const {timerState, contestItem, elapsed, availableTime, onTimeout} = props

    return (
        <div className="contest-info-component">
          <div className="contest-image" style={!contestItem ? {} : {backgroundImage: `url('${contestItem.contest_image}')`}} />
          <div className="contest-info">
              <div className="row title">
                  {!contestItem ? '' : contestItem.name}
              </div>
              <div className="row timer">
                  <Timer state={timerState} elapsed={elapsed} availableTime={availableTime} onTimeout={onTimeout}/>
              </div>
          </div>
        </div>)
}

// @flow

const React = require('react')
import type {ContestItem, TimerState} from "../../types.js"

import Timer from './Timer.jsx'

module.exports = (props:{contestItem: ?ContestItem, timerState: TimerState,availableTime: ?number, onTimeout: ()=> any})=> {

    const {timerState, contestItem, availableTime, onTimeout} = props

    return (
        <div className="contest-info-component">
          <div className="contest-image" style={!contestItem ? {} : {backgroundImage: `url('${contestItem.contest_image}')`}} />
          <div className="contest-info">
              <div className="row title">
                  {!contestItem ? '' : contestItem.name}
              </div>
              <div className="row timer">
                  <Timer state={timerState} availableTime={availableTime} onTimeout={onTimeout}/>
              </div>
          </div>
        </div>)
}

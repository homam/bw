// @flow

const React = require('react')
import type {ContestItem} from "../../types.js";

const Timer = require('./Timer.jsx')

module.exports = (props:{contestItem: ?ContestItem, startTime: number, penaltyMs: number, completed: boolean})=> {

    const {startTime, penaltyMs, completed, contestItem} = props

    return (
        <div className="contest-info-component">
          <div className="contest-image" style={!contestItem ? {} : {backgroundImage: `url('${contestItem.contest_image}')`}} />
          <div className="contest-info">
              <div className="row title">
                  {!contestItem ? '' : contestItem.name}
              </div>
              <div className="row timer">
                  <Timer startTime={startTime} penaltyMs={penaltyMs} pause={completed}/>
              </div>
          </div>
        </div>)
}

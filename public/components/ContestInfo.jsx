const React = require('react')
import type {ContestItem} from "../../types.js";

const Timer = require('./Timer.jsx')

module.exports = ({contestItem, startTime, penaltyMs, completed}:{contestItem: ContestItem, startTime: number, penaltyMs: number, completed: boolean})=> {

    const {contest_id, name, best_time, contest_image, time_remaining} = contestItem

    return (
        <div className="contest-info-component">
            <div className="row container">
                <div className="small-3 columns image-container">
                    <div className="contest-image" style={{backgroundImage: `url('${contest_image}')`}} />
                </div>
                <div className="small-9 columns">
                    <div className="row title">
                        {name}
                    </div>
                    <div className="row timer">
                        <Timer startTime={startTime} penaltyMs={penaltyMs} pause={completed}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

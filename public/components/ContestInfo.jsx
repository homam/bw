const React = require('react')
import type {ContestItem} from "../../types.js";

const Timer = require('./Timer.jsx')

module.exports = ({contestItem, startTime}:{contestItem: ContestItem, startTime: number})=> {

    const {contest_id, name, best_time, contest_image, time_remaining} = contestItem

    return (
        <div className="contest-info-component">
            <div className="row container">
                <div className="small-3 columns image-container">
                    <img src={contest_image} />
                </div>
                <div className="small-9 columns">
                    <div className="row title">
                        {name}
                    </div>
                    <div className="row">
                        <Timer startTime={startTime}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

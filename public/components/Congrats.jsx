const React = require('react')
const Leaderboard = require('./Leaderboard.jsx')
const Loading = require('./Loading.jsx')
import type {LeaderboardType} from "../../types.js";

module.exports = (props:{leaderboard: ?LeaderboardType})=> {

    return (
        <div className="congrats-component">

            <div className="column">
              <img src="/img/congrats.png" style={{width: '271px', height: '126px'}} />
            </div>
            <div style={{padding: '0 10% 0 10%'}}>
                {!!props.leaderboard ? <Leaderboard board={props.leaderboard.leaderboard} /> : <Loading />}
            </div>

        </div>
    )
}

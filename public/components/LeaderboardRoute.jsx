import React from 'react'
import {getLeadreboard} from '../modules/apis'
import type {LeaderboardType} from "../../types.js"
import Loading from './Loading.jsx'
import Leaderboard from './Leaderboard.jsx'
import ContestInfo from './ContestInfo.jsx'

export default class LeaderboardRoute extends React.Component {

    state: {
        contestId: number
        , leaderboard: LeaderboardType
    }

    constructor(props) {
        super(props)

        this.state = {
            contestId: (parseInt(props.params.contestId) : number)
            , leaderboard: (null: ?LeaderboardType)
        }
    }

    componentDidMount() {
        getLeadreboard(this.state.contestId, false).then((leaderboard: LeaderboardType)=> {
            this.setState({leaderboard: leaderboard})
        })
    }

    render() {
        return (
            <div className="leaderboard-route">
                <div className={("content " + (!!this.state.leaderboard ? '' : 'transitioning'))}>
                    {!!this.state.leaderboard && <div>
                        <div className="contest-info-component">
                            <div className="contest-image" style={{backgroundImage: `url('${this.state.leaderboard.contest.contest_image}')`}} />
                            <div className="contest-info">
                                <div className="row title">
                                    {this.state.leaderboard.contest.name}
                                </div>
                                <div className="row">
                                    <p>Leaderboard</p>
                                </div>
                            </div>
                        </div>
                        <Leaderboard board={this.state.leaderboard.leaderboard} />
                    </div>}
                </div>

                {!this.state.leaderboard && <Loading />}
            </div>
        )
    }
}

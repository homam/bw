// @flow

const React = require('react')
const Leaderboard = require('./Leaderboard.jsx')
const Loading = require('./Loading.jsx')
const {getLeadreboard} = require('../modules/apis')
import type {LeaderboardType, LeaderboardItem} from "../../types.js"
import R from 'ramda'

class Congrats extends React.Component {

    state: {
        leaderboard: ?LeaderboardType
    }

    constructor(props: {contestId: number}) {
        super(props)

        this.state = {
            leaderboard: (null: ?LeaderboardType)
        }
    }

    componentDidMount() {
        getLeadreboard(this.props.contestId, true).then((leaderboard: LeaderboardType)=> {
            this.setState({leaderboard})
        })
    }

    getHighlightedPosition(leaderboard: Array<LeaderboardItem>) {
        return R.compose(R.prop('position'), R.find(({highlight})=> !!highlight))(leaderboard)
    }

    render() {
        const myPosition = !!this.state.leaderboard ? this.getHighlightedPosition(this.state.leaderboard.leaderboard) : 0

        return (<div className="congrats-component">

            <div className="column">
              <img src="/img/congrats.png" style={{width: '271px', height: '126px'}} />
            </div>

            {!!this.state.leaderboard ? <div>
                <div className="row">
                    <p>You are #{myPosition} on the leaderboard!</p>
                </div>
                <div style={{padding: '0 10% 0 10%'}}>
                    <Leaderboard board={this.state.leaderboard.leaderboard} />
                </div>
            </div> : <Loading />}
        </div>)
    }

}

module.exports = Congrats

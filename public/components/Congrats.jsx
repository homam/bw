// @flow

const React = require('react')
const Leaderboard = require('./Leaderboard.jsx')
const Loading = require('./Loading.jsx')
const {getLeadreboard} = require('../modules/apis')
import type {LeaderboardType} from "../../types.js"

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

    componentDidMount(){
        getLeadreboard(this.props.contestId, true).then((leaderboard: LeaderboardType)=> {
            this.setState({leaderboard})
        })
    }

    render() {
        return (<div className="congrats-component">

            <div className="column">
              <img src="/img/congrats.png" style={{width: '271px', height: '126px'}} />
            </div>
            <div style={{padding: '0 10% 0 10%'}}>
                {!!this.state.leaderboard ? <Leaderboard board={this.state.leaderboard.leaderboard} /> : <Loading />}
            </div>

        </div>)
    }

}

module.exports = Congrats

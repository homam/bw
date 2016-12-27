// @flow

const React = require('react')
const R = require('ramda')
const {getContestList} = require('../modules/apis')
import type {ContestItem} from "../../types.js";

const ContestThumb = require('./ContestThumb.jsx')


const constructContestItem = (item: Object): ContestItem => {
    const {contest_id, name, best_time, contest_image, time_remaining} = item

    return {
        contest_id: contest_id
        , name
        , best_time: best_time
        , contest_image: `https://prizefrenzy.com/api/games/${contest_image}`
        , time_remaining: time_remaining
    }
}


module.exports = React.createClass({

    render() {

        const ContestThumbList = R.map(({contest_id, name, best_time, contest_image, time_remaining})=>
            <ContestThumb
                key={contest_id}
                contestId={contest_id}
                name={name}
                bestTime={best_time}
                contestImage={contest_image}
                timeRemaining={time_remaining} />
        )(this.state.contestList)

        return (
            <div className="home-route">
                Home route
                {ContestThumbList}
            </div>
        )
    }

    , getInitialState() {
        const initialState: {
            contestList: Array<ContestItem>
        } = {
            contestList: []
        }

        return initialState
    }

    , componentDidMount() {
        getContestList()
        .then((contestList)=> {
            this.setState({contestList: contestList})
        })
    }

})

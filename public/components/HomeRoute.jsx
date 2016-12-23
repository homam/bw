// @flow

const React = require('react')
const R = require('ramda')
const {getContestList} = require('../modules/apis')
import type {ContestItem} from "../../types.js";

const ContestThumb = require('./ContestThumb.jsx')


const constructContestItem = (item: Object): ContestItem => {
    const {contest_id, name, best_time, contest_image, time_remaining} = item

    return {
        contestId: contest_id
        , name
        , bestTime: best_time
        , contestImage: `https://prizefrenzy.com/api/games/${contest_image}`
        , timeRemaining: time_remaining
    }
}


module.exports = React.createClass({

    render() {

        const ContestThumbList = R.map(({contestId, name, bestTime, contestImage, timeRemaining})=>
            <ContestThumb
                key={contestId}
                contestId={contestId}
                name={name}
                bestTime={bestTime}
                contestImage={contestImage}
                timeRemaining={timeRemaining} />
        )(this.state.contestList)

        return (
            <div className="home-route">
                Home route
                {ContestThumbList}
            </div>
        )
    }

    , getInitialState() {
        return {
            contestList: []
        }
    }

    , componentDidMount() {
        getContestList()
        .then(({data})=> {

            const contestList = R.compose(
                R.map(constructContestItem)
                , R.values
                , R.prop('data')
            )(data)

            this.setState({contestList})
        })
    }

})

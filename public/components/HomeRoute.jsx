// @flow

const React = require('react')
const R = require('ramda')
const {getContestList} = require('../modules/apis')
import type {ContestItem} from "../../types.js"
const {preloadImages} = require('../modules/utils')
const {createHashHistory} = require('history')
const history = createHashHistory()

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

    displayName: 'home-route'

    , render() {

        const ContestThumbList = R.map((contestItem)=>
            <ContestThumb
                key={contestItem.contest_id}
                contestItem={{...contestItem, unlocked: 1}}
                onClick={({contest_id})=> {
                    // @TODO: implement the pin flow
                    history.push(`/contest/${contest_id}/play`)
                }} />
        )(this.state.contestList)

        return (
            <div className="home-route">
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
    },

    componentDidUpdate() {
        preloadImages(['/img/bg-curtain.png'])
    }

})

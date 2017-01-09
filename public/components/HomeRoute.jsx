// @flow

const React = require('react')
const R = require('ramda')
const {getContestList, registration, pinVerification} = require('../modules/apis')
import type {ContestItem} from "../../types.js"
const {preloadImages} = require('../modules/utils')
const {createHashHistory} = require('history')
const cookie = require('react-cookie')
const history = createHashHistory()
const {imagePath} = require('../config')
const ContestThumb = require('./ContestThumb.jsx')
const NumberEntry = require('./NumberEntry.jsx')
const PinEntry = require('./PinEntry.jsx')


const constructContestItem = (item: Object): ContestItem => {
    const {contest_id, name, best_time, contest_image, time_remaining} = item

    return {
        contest_id: contest_id
        , name
        , best_time: best_time
        , contest_image: `${imagePath}${contest_image}`
        , time_remaining: time_remaining
    }
}


module.exports = React.createClass({

    displayName: 'home-route'

    , render() {

        const ContestThumbList = R.map((contestItem)=>
            <ContestThumb
                key={contestItem.contest_id}
                contestItem={contestItem}
                onClick={({contest_id, unlocked})=> {
                    if (!!unlocked) {
                        return history.push(`/contest/${contest_id}/play`)
                    } else {
                        this.setState({
                            selectedContestId: contest_id
                            , authStage: ((!!this.state.msisdn) ? 'pin-entry' : 'msisdn-entry')
                        })
                    }
                }} />
        )(this.state.contestList)

        return (
            <div className="home-route">
                {this.state.authStage == 'msisdn-entry' && <NumberEntry
                    contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                    onSubmit={(msisdn)=> {
                        if (this.state.authenticationLevel == 'anonymous') {
                            registration(msisdn, this.state.selectedContestId, "BigwinApp")
                            .then((d)=> {
                                this.setState({msisdn: msisdn, authStage: 'pin-entry'})
                            })
                            .catch((e)=> console.log(e))
                        } else {
                            console.log('subscription flow', this.state.selectedContestId, msisdn)
                        }
                    }
                } />}

                {this.state.authStage == 'pin-entry' && <PinEntry
                    contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                    onSubmit={(pincode)=> {
                        pinVerification(this.state.msisdn, this.state.selectedContestId, parseInt(pincode))
                        .then(({access_token, expires_in})=> {

                            cookie.save('access_token', access_token, {
                                maxAge: new Date(expires_in)
                                , authenticationLevel: 'user'
                            })

                        })
                        .catch((e)=> console.log(e))
                    }
                } />}

                {ContestThumbList}
            </div>
        )
    }

    , getInitialState() {
        const initialState: {
            contestList: Array<ContestItem>
            , authenticationLevel: string
            , msisdn: string | null
            , authStage: 'msisdn-entry' | 'pin-entry' | 'congrats' | null
            , selectedContestId: number | null
        } = {
            contestList: []
            , authenticationLevel: cookie.load('authentication_level')
            , msisdn: cookie.load('msisdn')
            , authStage: null
            , selectedContestId: null
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

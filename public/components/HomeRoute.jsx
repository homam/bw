// @flow

const React = require('react')
const R = require('ramda')
const {getContestList, registration, subscription, pinVerification} = require('../modules/apis')
import type {ContestItem} from "../../types.js"
const {preloadImages} = require('../modules/utils')
const {createHashHistory} = require('history')
const cookie = require('react-cookie')
const history = createHashHistory()
const {imagePath} = require('../config')
const ContestThumb = require('./ContestThumb.jsx')
const NumberEntry = require('./NumberEntry.jsx')
const PinEntry = require('./PinEntry.jsx')
const RegisterCongrats = require('./RegisterCongrats.jsx')


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
                loading={(this.state.selectedContestId == contestItem.contest_id && this.state.showLoading)}
                contestItem={contestItem}
                onClick={({contest_id, unlocked})=> {
                    if (!!unlocked) {
                        return history.push(`/contest/${contest_id}/play`)
                    } else {

                        if (this.state.authenticationLevel == 'anonymous') {
                            this.setState({selectedContestId: contest_id, authStage: 'msisdn-entry'})
                        } else {
                            this.setState({selectedContestId: contest_id, showLoading: true})

                            subscription(contest_id, "BigwinApp")
                            .then((d)=> {
                                this.setState({authStage: 'pin-entry', showLoading: false})
                            })
                            .catch(({message})=> {
                                this.setState({showLoading: false, authError: message})
                            })
                        }

                    }
                }} />
        )(this.state.contestList)

        return (
            <div className="home-route">
                {this.state.authStage == 'msisdn-entry' && <NumberEntry
                    contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                    loading={this.state.showLoading}
                    error={this.state.authError}
                    onSubmit={(msisdn)=> {
                        this.setState({showLoading: true})

                        registration(msisdn, this.state.selectedContestId, "BigwinApp")
                        .then((d)=> {
                            this.setState({msisdn: msisdn, authStage: 'pin-entry', showLoading: false})
                        })
                        .catch(({message})=> {
                            this.setState({showLoading: false, authError: message})
                        })
                    }
                } />}

                {this.state.authStage == 'pin-entry' && <PinEntry
                    contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                    loading={this.state.showLoading}
                    error={this.state.authError}
                    onSubmit={(pincode)=> {
                        this.setState({showLoading: true})

                        pinVerification(this.state.msisdn, this.state.selectedContestId, parseInt(pincode))
                        .then(({access_token, expires_in})=> {

                            if (this.state.authenticationLevel == 'anonymous') {
                                cookie.save('msisdn', this.state.msisdn, {maxAge: new Date(expires_in)})
                                cookie.save('access_token', access_token, {maxAge: new Date(expires_in)})
                                cookie.save('authentication_level', 'user', {maxAge: new Date(expires_in)})
                            }

                            this.setState({authStage: 'congrats', showLoading: false})
                        })
                        .catch(({message})=> {
                            this.setState({showLoading: false, authError: message})
                        })
                    }
                } />}

                {this.state.authStage == 'congrats' && <RegisterCongrats
                    contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                    onClick={()=> {
                        return history.push(`/contest/${this.state.selectedContestId}/play`)
                    }}
                />}

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
            , showLoading: boolean
            , authError: string | null
        } = {
            contestList: []
            , authenticationLevel: cookie.load('authentication_level')
            , msisdn: cookie.load('msisdn')
            , authStage: null
            , selectedContestId: null
            , showLoading: false
            , authError: null
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

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
const {waitSeq} = require('../modules/async')

type AuthStage = 'msisdn-entry' | 'pin-entry' | 'congrats'

class HomeRoute extends React.Component {

    state: {
        contestList: Array<ContestItem>
        , authStage: ?AuthStage
        , selectedContestId: ?number
        , showLoading: boolean
        , authError: ?string
        , formMsisdn: ?string
    }

    props: {
        msisdn: ?string
        , authenticationLevel: ?string
        , accessToken: ?string
        , onChange: () => any
    }

    constructor(props) {
        super(props)
        this.state = {
            contestList: ([]: Array<ContestItem>)
            , authStage: (null: ?AuthStage)
            , selectedContestId: (null: ?number)
            , showLoading: false
            , authError: (null: ?string)
            , formMsisdn: (null: ?string)
        }
    }

    render() {

        const ContestThumbList = R.map((contestItem)=>
            <ContestThumb
                key={contestItem.contest_id}
                loading={(this.state.selectedContestId == contestItem.contest_id && this.state.showLoading)}
                contestItem={contestItem}
                onClick={({contest_id, unlocked})=> {
                    if (!!unlocked) {
                        return history.push(`/contest/${contest_id}/play`)
                    } else {

                        if (this.props.authenticationLevel == 'anonymous') {
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
                <div className={(this.state.authStage == 'msisdn-entry') ? 'transition' : 'transition hide'}>
                    {this.state.authStage == 'msisdn-entry' && <NumberEntry
                        contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                        loading={this.state.showLoading}
                        error={this.state.authError}
                        onSubmit={(msisdn)=> {
                            this.setState({showLoading: true})

                            registration(msisdn, this.state.selectedContestId, "BigwinApp")
                            .then((d)=> {
                                this.setState({formMsisdn: msisdn, authStage: 'pin-entry', showLoading: false})
                            })
                            .catch(({message})=> {
                                this.setState({showLoading: false, authError: message})
                            })
                        }
                    } />}
                </div>

                <div className={(this.state.authStage == 'pin-entry') ? 'transition' : 'transition hide'}>
                    {this.state.authStage == 'pin-entry' && <PinEntry
                        contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                        loading={this.state.showLoading}
                        error={this.state.authError}
                        onSubmit={(pincode)=> {
                            this.setState({showLoading: true})

                            pinVerification(this.state.formMsisdn, this.state.selectedContestId, parseInt(pincode))
                            .then(({access_token, expires_in})=> {

                                if (this.props.authenticationLevel == 'anonymous') {
                                    this.props.onChange({msisdn: this.state.formMsisdn, accessToken: access_token, authenticationLevel: 'user'})

                                    cookie.save('msisdn', this.state.formMsisdn, {maxAge: new Date(expires_in)})
                                    cookie.save('access_token', access_token, {maxAge: new Date(expires_in)})
                                    cookie.save('authentication_level', 'user', {maxAge: new Date(expires_in)})
                                }

                                // clean the cache of the memoized function to load the new list of contests
                                getContestList.cleanCache()

                                this.setState({authStage: 'congrats', showLoading: false})
                            })
                            .catch(({message})=> {
                                this.setState({showLoading: false, authError: message})
                            })
                        }
                    } />}
                </div>

                <div className={(this.state.authStage == 'congrats') ? 'transition' : 'transition hide'}>
                    {this.state.authStage == 'congrats' && <RegisterCongrats
                        contestItem={R.find((x)=> x.contest_id == this.state.selectedContestId)(this.state.contestList)}
                        onClick={()=> {
                            if (this.state.selectedContestId)
                                return history.push(`/contest/${this.state.selectedContestId}/play`)
                        }}
                    />}
                </div>

                <div className={(!!this.state.authStage) ? 'transition hide' : 'transition'}>{ContestThumbList}</div>
            </div>
        )
    }

    componentDidMount() {
        // pass the access token to make fresh request (when user logs in, access_token changes and we need to make new request to get the contest list)
        // just needed to feed the momoizing function to avoid reading from the cache
        getContestList(this.props.accessToken)
        .then((contestList)=> {
            this.setState({contestList: contestList})
        })
    }

    componentDidUpdate() {
        preloadImages(['/img/bg-curtain.png'])
    }

}

export default HomeRoute

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
import Loading from './Loading.jsx'

type AuthStage = 'msisdn-entry' | 'pin-entry' | 'congrats'

class HomeRoute extends React.Component {

    state: {
        contestList: Array<ContestItem>
        , authStage: ?AuthStage
        , selectedGameId: ?number
        , showLoading: boolean
        , authError: ?string
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
            , selectedGameId: (null: ?number)
            , showLoading: false
            , authError: (null: ?string)
        }
    }

    createContestThumbElem(selectedGameId, showLoading, contestItem) {
        return (
        <ContestThumb
            key={contestItem.contest_id}
            loading={(selectedGameId == contestItem.game_id && showLoading)}
            contestItem={contestItem}
            onClick={({game_id, unlocked})=> {
                if (!!unlocked) {
                    return history.push(`/contest/${game_id}/play`)
                } else {

                    if (this.props.authenticationLevel == 'anonymous') {
                        this.setState({selectedGameId: game_id, authStage: 'msisdn-entry'})
                    } else {
                        this.setState({selectedGameId: game_id, showLoading: true})

                        subscription(game_id, "BigwinApp")
                        .then((d)=> {
                            this.setState({authStage: 'pin-entry', showLoading: false})
                        })
                        .catch(({message})=> {
                            this.setState({showLoading: false, authError: message})
                        })
                    }

                }
            }}
        />
        )
    }

    render() {

        const unlockedContests = R.filter((it)=> it.unlocked)(this.state.contestList)
        const newContests = R.filter((it)=> !it.unlocked)(this.state.contestList)
        const createThumb = R.curry(this.createContestThumbElem.bind(this))(this.state.selectedGameId, this.state.showLoading)

        const unlockedContestThumbList = R.map(createThumb)(unlockedContests)
        const newContestThumbList = R.map(createThumb)(newContests)

        return (
            <div className={!!this.state.authStage ? "home-route overlay" : "home-route"}>
                <div className={(this.state.authStage == 'msisdn-entry') ? 'transition' : 'transition hide'}>
                    {this.state.authStage == 'msisdn-entry' && <NumberEntry
                        contestItem={R.find((x)=> x.game_id == this.state.selectedGameId)(this.state.contestList)}
                        loading={this.state.showLoading}
                        error={this.state.authError}
                        onSubmit={(msisdn)=> {
                            this.setState({showLoading: true})

                            const subscribeUser = R.composeP(
                                (({access_token, token_type, expires_in})=> {

                                    this.props.onChange({
                                        msisdn: msisdn,
                                        accessToken: access_token,
                                        authenticationLevel: 'user'
                                    })

                                    cookie.save('msisdn', msisdn, {maxAge: new Date(expires_in)})
                                    cookie.save('access_token', access_token, {maxAge: new Date(expires_in)})
                                    cookie.save('authentication_level', 'user', {maxAge: new Date(expires_in)})

                                    return subscription(this.state.selectedGameId, "BigwinApp")
                                }),
                                registration
                            )

                            subscribeUser(msisdn)
                            .then((d)=> {
                                this.setState({authStage: 'pin-entry', showLoading: false})
                            })
                            .catch(({message})=> {
                                this.setState({showLoading: false, authError: message})
                            })
                        }
                    } />}
                </div>

                <div className={(this.state.authStage == 'pin-entry') ? 'transition' : 'transition hide'}>
                    {this.state.authStage == 'pin-entry' && <PinEntry
                        contestItem={R.find((x)=> x.game_id == this.state.selectedGameId)(this.state.contestList)}
                        loading={this.state.showLoading}
                        error={this.state.authError}
                        onSubmit={(pincode)=> {
                            this.setState({showLoading: true})

                            pinVerification(this.props.msisdn, this.state.selectedGameId, parseInt(pincode))
                            .then(({access_token, expires_in})=> {
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
                        contestItem={R.find((x)=> x.contest_id == this.state.selectedGameId)(this.state.contestList)}
                        onClick={()=> {
                            if (this.state.selectedGameId)
                                return history.push(`/contest/${this.state.selectedGameId}/play`)
                        }}
                    />}
                </div>

                <div className={(!!this.state.authStage) ? 'transition hide' : 'transition'}>
                    {!R.isEmpty(unlockedContests) && <div>
                        <h3>My Games</h3>
                        {unlockedContestThumbList}
                    </div>}

                    {!R.isEmpty(newContests) && <div>
                        <h3>New Games</h3>
                        {newContestThumbList}
                        {newContestThumbList}
                        {newContestThumbList}
                        {newContestThumbList}
                        {newContestThumbList}
                        {newContestThumbList}
                    </div>}
                </div>

                {R.isEmpty(this.state.contestList) && <Loading />}
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

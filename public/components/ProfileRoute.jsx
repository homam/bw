const React = require('react')
const {getProfile, updateProfile} = require('../modules/apis')
const {debounce} = require("../modules/utils.js")
import type {Profile} from "../../types.js"
const Loading = require('./Loading.jsx')

export default class ProfileRoute extends React.Component {

    state: {
        profile: Profile | null,
        errorMessage: ?string
    }

    constructor(props) {
        super(props)

        this.state = {
            profile: (null : ?Profile),
            errorMessage: (null: ?string)
        }
    }

    onChange = debounce(()=> {
        this.setState({errorMessage: null})

        updateProfile(this.state.profile.first_name)
        .catch(({message})=> this.setState({errorMessage: message}))
    }, 1000)

    render() {
        return (
            <div className="profile-route">
                <h3>Profile</h3>

                {!this.state.profile && <Loading />}

                {this.state.profile && <div className="box">
                    <input type="text" className="name" placeholder="Your name" value={this.state.profile.first_name} onChange={({target})=> {
                        this.setState({profile: {...this.state.profile, first_name: target.value}})
                        this.onChange()
                    }} />
                    <input type="text" className="mobile" placeholder="Mobile number" value={this.state.profile.username} disabled />
                </div>}

                <p className="error">{this.state.errorMessage}</p>
            </div>
        )
    }

    componentDidMount() {
        getProfile()
        .then((profile)=> this.setState({profile: profile}))
    }
}

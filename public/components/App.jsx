// @flow

const ReactDOM = require('react-dom')
const React = require('react')
const R = require('ramda')
const {Match, Miss, Link, Redirect, BrowserRouter, HashRouter} = require('react-router')
const { TransitionMotion, spring } = require('react-motion')
const Header = require('./Header.jsx')
import HomeRoute from './HomeRoute.jsx'
import PlayRoute from './PlayRoute.jsx'
import ProfileRoute from './ProfileRoute.jsx'
import LeaderboardRoute from './LeaderboardRoute.jsx'
const Menu = require('./Menu.jsx')
const cookie = require('react-cookie')

const fadeStyles =  {
  position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
}

const MatchWithFade = ({ component:Component, ...rest }) => {
    const willLeave = () => ({ zIndex: 1, opacity: spring(0) })

    return (
        <Match {...rest} children={({ matched, ...props }) => (
            <TransitionMotion
                willLeave={willLeave}
                styles={matched ? [ {
                    key: props.location.pathname,
                    style: { opacity: 1 },
                    data: props
                } ] : []}
            >
                {interpolatedStyles => (
                    <div>
                        {interpolatedStyles.map(config => (
                            <div
                                key={config.key}
                                style={{ ...fadeStyles, ...config.style }}
                            >
                                <Component {...config.data} {...rest}/>
                            </div>
                        ))}
                    </div>
                )}
            </TransitionMotion>
        )}/>
    )
}


class App extends React.Component {

    state: {
        authenticationLevel: ?string
        , msisdn: ?string
        , accessToken: ?string
        , isMenuOpen: bool
    }

    constructor(props) {
        super(props)
        this.state = {
            authenticationLevel: (cookie.load('authentication_level') : ?string)
            , msisdn: (cookie.load('msisdn') : ?string)
            , accessToken: (cookie.load('access_token') : ?string)
            , isMenuOpen: false
        }
    }

    toggleMenu() {
      if(this.state.isMenuOpen) {
        document.body.classList.remove('menu-open')
      } else {
        document.body.classList.add('menu-open')
      }
      this.setState({isMenuOpen: !this.state.isMenuOpen})
    }

    render(props) {

        // const currentRouteName = this.props.routes[this.props.routes.length-1].label
        const currentRouteName = this.props.location.pathname

        return (
            <div className={`container${this.state.isMenuOpen ? ' menu-open' : ''}`}>
                <div className="menu">
                    <Menu isAuthenticated={this.state.authenticationLevel == 'user'} currentRoute={currentRouteName} toggleMenu={this.toggleMenu.bind(this)} />
                </div>
                <div className="menu-blocker" onTouchStart={() => this.toggleMenu()} />
                <header>
                    <Header routeName={currentRouteName} toggleMenu={this.toggleMenu.bind(this)} />
                </header>
                <div className="body">
                    <MatchWithFade
                        label="home"
                        pattern="/"
                        exactly
                        component={HomeRoute}
                        authenticationLevel={this.state.authenticationLevel}
                        msisdn={this.state.msisdn}
                        accessToken={this.state.accessToken}
                        onChange={({authenticationLevel, msisdn, accessToken})=> {
                            this.setState({authenticationLevel, msisdn, accessToken})
                        }}
                    />
                    <MatchWithFade label="play" pattern="/contest/:contestId/play" exactly component={PlayRoute} />
                    <MatchWithFade label="profile" pattern="/profile" exactly component={ProfileRoute} />
                    <MatchWithFade label="leaderboard" pattern="/leaderboard/:contestId" exactly component={LeaderboardRoute} />
                </div>
            </div>
        )
    }

}

ReactDOM.render(
    <HashRouter>
        <Match pattern="/" component={App} />
    </HashRouter>
    , document.getElementById('app-container')
)

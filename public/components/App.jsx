// @flow

const ReactDOM = require('react-dom')
const React = require('react')
const R = require('ramda')
const {Match, Miss, Link, Redirect, BrowserRouter, HashRouter} = require('react-router')
const { TransitionMotion, spring } = require('react-motion')
const Header = require('./Header.jsx')
const HomeRoute = require('./HomeRoute.jsx')
import PlayRoute from './PlayRoute.jsx'
const Menu = require('./Menu.jsx')

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
      isMenuOpen: bool
    }

    constructor(props) {
      super(props)
      this.state = {
        isMenuOpen: false
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
                    <Menu toggleMenu={this.toggleMenu.bind(this)} />
                </div>
                <div className="menu-blocker" onTouchStart={() => this.toggleMenu()} />
                <header>
                    <Header routeName={currentRouteName} toggleMenu={this.toggleMenu.bind(this)} />
                </header>
                <div className="body">
                    <MatchWithFade label="home" pattern="/" exactly component={HomeRoute} />
                    <MatchWithFade label="play" pattern="/contest/:contestId/play" exactly component={PlayRoute} />
                </div>
            </div>
        )
    }

}

ReactDOM.render(
    <HashRouter>
        <Match pattern="/" component={App}/>
    </HashRouter>
    , document.getElementById('app-container')
)

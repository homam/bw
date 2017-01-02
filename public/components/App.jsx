// @flow

const ReactDOM = require('react-dom')
const React = require('react')
const R = require('ramda')
const {Router, Route, IndexRoute, browserHistory, hashHistory} = require('react-router')

const Header = require('./Header.jsx')
const HomeRoute = require('./HomeRoute.jsx')
import PlayRoute from './PlayRoute.jsx'
// const CongratsRoute = require('./CongratsRoute.jsx')
const Menu = require('./Menu.jsx')


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

    render() {
        const currentRouteName = this.props.routes[this.props.routes.length-1].label

        return (<div className={`container${this.state.isMenuOpen ? ' menu-open' : ''}`}>
          <div className="menu">
            <Menu />
          </div>
          <div className="menu-blocker" onTouchStart={() => this.toggleMenu()} />
          <header>
            <Header routeName={currentRouteName} toggleMenu={this.toggleMenu.bind(this)} />
          </header>
          <div className="body">
            {this.props.children}
          </div>
        </div>)
    }

}


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" label="home" component={App}>
            <IndexRoute label="home" component={HomeRoute}/>
            <Route label="play" path="contest/:contestId/play" component={PlayRoute}/>
        </Route>
    </Router>
    , document.getElementById('app-container')
)

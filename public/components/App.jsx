// @flow

const ReactDOM = require('react-dom')
const React = require('react')
const R = require('ramda')
const {Router, Route, IndexRoute, browserHistory, hashHistory} = require('react-router')

const Header = require('./Header.jsx')
const HomeRoute = require('./HomeRoute.jsx')
const PlayRoute = require('./PlayRoute.jsx')
const CongratsRoute = require('./CongratsRoute.jsx')
const Menu = require('./Menu.jsx')


const App = React.createClass({

    render() {
        const currentRouteName = R.path(['routes', 1, 'component', 'displayName'])(this.props)

        return (<div className="container">
            <div className="off-canvas-wrap" data-offcanvas>
                <div className="inner-wrap">

                    <Menu />
                    <Header routeName={currentRouteName} />
                    {this.props.children}
                    <a className="exit-off-canvas"></a>

                </div>
            </div>
        </div>)
    }

})


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomeRoute}/>
            <Route path="contest/:contestId/play" component={PlayRoute}/>
            <Route path="contest/:contestId/congrats" component={CongratsRoute}/>
        </Route>
    </Router>
    , document.getElementById('app-container')
)

// @flow

const ReactDOM = require('react-dom')
const React = require('react')
const {Router, Route, IndexRoute, browserHistory, hashHistory} = require('react-router')

const Header = require('./Header.jsx')
const HomeRoute = require('./HomeRoute.jsx')


const App = React.createClass({

    render() {
        return (
            <div className="container">
                <Header />
                {this.props.children}
            </div>
        )
    }

})


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomeRoute}/>
            // <Route path="home" component={HomeRoute}/>
        </Route>
    </Router>
    , document.getElementById('app-container')
)

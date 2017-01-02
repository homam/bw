const React = require('react')
const Leaderboard = require('./Leaderboard.jsx')

//TODO: test data
const data = [{rank: 17, name: 'Johnny', time: 4123}, {rank: 18, name: 'Homam', time: 25812, me: true},{rank: 19, name: 'Edgar', time: 26001}, {rank: 20, name: 'Tom', time: 28633}]

module.exports = React.createClass({

    displayName: 'congrats-component'

    , render() {
        return (
            <div className="congrats-component">

                <div className="column">
                  <img src="/img/congrats.png" style={{width: '271px', height: '126px'}} />
                </div>
                <div style={{padding: '0 10% 0 10%'}}>
                    <Leaderboard board={data} />
                </div>

            </div>)
    }
})

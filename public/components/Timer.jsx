const React = require('react')
const moment = require('moment')
const ReactTimeout = require('react-timeout')

module.exports = ReactTimeout(React.createClass({

    render() {

        const time = moment(this.state.elapsed)

        return <div className="timer-component">{time.format('mm: ss: SS')}</div>
    }

    , getInitialState() {
        return { elapsed: 0 }
    }

    , componentDidMount() {
        this.props.setTimeout(this.tick, 50)
    }

    , tick() {
        this.setState({elapsed: new Date() - this.props.startTime + this.props.penaltyMs})
        this.props.setTimeout(this.tick, 50)
    }

}))

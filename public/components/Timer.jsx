const React = require('react')
const moment = require('moment')
const ReactTimeout = require('react-timeout')


const formatTime = (ms: number): string => {
    const time = moment(ms)
    return time.format('mm: ss: SS')
}


module.exports = ReactTimeout(React.createClass({

    elapsed: 0

    , render() {
        return <div className="timer-component" ref="timer">{formatTime(this.elapsed)}</div>
    }

    , componentDidMount() {
        this.props.setTimeout(this.tick, 50)
    }

    , tick() {

        this.elapsed = new Date() - this.props.startTime + this.props.penaltyMs
        this.refs.timer.innerHTML = formatTime(this.elapsed)

        if (!this.props.pause)
            this.props.setTimeout(this.tick, 50)
    }

}))

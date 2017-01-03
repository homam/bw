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
        // set the time returned by the api at the end of the contest
        if (!!this.props.elapsed)
            this.elapsed = this.props.elapsed

        return <div className="timer-component" ref="timer">{formatTime(this.elapsed)}</div>
    }

    , componentDidMount() {
        if (!this.props.pause && !this.props.elapsed)
            this.props.setTimeout(this.tick, 50)
    }

    , tick() {

        if (!this.props.pause && !this.props.elapsed)
            this.elapsed = new Date() - this.props.startTime + this.props.penaltyMs
            this.refs.timer.innerHTML = formatTime(this.elapsed)

            this.props.setTimeout(this.tick, 50)
    }

}))

const React = require('react')
const moment = require('moment')
const ReactTimeout = require('react-timeout')

module.exports = ReactTimeout(React.createClass({

    render() {

        const time = moment(this.state.elapsed)

        return <p>{time.format('mm: ss: SSS')}</p>
    }

    , getInitialState() {
        return { elapsed: 0 }
    }

    , componentDidMount() {
        this.props.setTimeout(this.tick, 50)
    }

    , tick() {
        this.setState({elapsed: new Date() - this.props.startTime})
        this.props.setTimeout(this.tick, 50)
    }

}))

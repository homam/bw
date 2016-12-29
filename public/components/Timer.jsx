const React = require('react')
const moment = require('moment')

module.exports = React.createClass({

    render() {

        const time = moment(this.state.elapsed)

        return <p>{time.format('mm: ss: SSS')}</p>
    }

    , getInitialState() {
        return { elapsed: 0 }
    }

    , componentDidMount() {
        setTimeout(this.tick, 50)
    }

    , tick() {
        this.setState({elapsed: new Date() - this.props.startTime})
        setTimeout(this.tick, 50)
    }

})

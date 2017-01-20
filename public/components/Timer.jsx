// @flow

const React = require('react')
const moment = require('moment')
import type {TimerState} from "../../types.js"

type Props = {
    elapsed: number
    , availableTime: ?number
    , state: TimerState
    , onTimeout: ()=> any
}


const formatTime = (ms: number): string =>
    moment(ms).format('mm: ss: SS')


export default class Timer extends React.Component {

    elapsed: number
    timer: ?number

    constructor(props: Props){
        super(props)

        this.elapsed = 0
        this.timer = null
    }

    render() {
        return (
            <div className="timer-component" ref="timer">--: --: --</div>
        )
    }

    componentDidUpdate(prevProps: Props) {
        // when component renders, the availableTime is not known
        // start the tick() when its available
        if (!!this.props.availableTime && prevProps.availableTime != this.props.availableTime) {
            window.clearTimeout(this.timer)
            this.start()
        }

        // sync the elapsed time with the server
        if (!!this.props.elapsed && prevProps.elapsed != this.props.elapsed) {
            // window.clearTimeout(this.timer)
            this.elapsed = this.props.elapsed
            // this.start()
        }

        // manage the state of the timer
        switch (this.props.state) {
            case 'pause':
                this.pause()
                break;
            case 'start':
                this.start()
                break;
            case 'restart':
                this.restart()
                break;
        }
    }

    componentWillUnmount() {
        this.pause()
    }

    pause() {
        window.clearTimeout(this.timer)
    }

    start() {
        this.tick()
    }

    restart() {
        this.pause()
        this.elapsed = 0
        this.start()
    }

    tick() {
        this.elapsed = this.elapsed + 50
        const timeLeft = this.props.availableTime - this.elapsed

        this.refs.timer.innerHTML = formatTime(timeLeft <= 0 ? 0 : timeLeft)

        if (timeLeft <= 0) {
            this.pause()
            this.props.onTimeout()
            return
        }

        this.timer = setTimeout(this.tick.bind(this), 50)
    }

}

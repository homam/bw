// @flow

const React = require('react')

type CountdownProps = {from: number}

class Countdown extends React.Component  {
  time: number;
  _interval: number;
  props: CountdownProps;
  constructor(props : CountdownProps) {
    super(props);
    const {from} = this.props
    this.time = from
    this._interval = setInterval(() => {
      const time = this.time - 1
      this.time = time
      this.refs.time.className = 'playCountdown'
      this.refs.time.innerHTML = ''
      setTimeout(() => {
        this.refs.time.className = 'playCountdown time'
        this.refs.time.innerHTML = time > 0 ? time.toString() : 'GO!'
      }, 100)
      if(time == 0) {
        clearInterval(this._interval)
      }
    }, 1000)
  }
  componentWillUnmount() {
    if(!!this._interval)
      clearInterval(this._interval)
  }
  render() {
    return <div className='playCountdown' ref='time'></div>
  }
}

module.exports = Countdown

const React = require('react')
const moment = require('moment')

module.exports = (props)=> {

    const time = moment(props.time)
    const mm = time.get('minutes')
    const ss = time.get('seconds')
    const ms = time.get('millisecond')

    return (
        <div className="contest-info-component">
            {mm}: {ss}: {ms}
        </div>
    )
}

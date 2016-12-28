const React = require('react')

module.exports = (props)=> {

    const progressBarStyle = {width: `${props.progress}%`}

    return (
        <div className="progress-bar-component">
            <div className="progress success round">
                <span className="meter" style={progressBarStyle}></span>
            </div>
        </div>
    )
}

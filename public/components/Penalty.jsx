const React = require('react')

module.exports = (props)=> {

    return (
        <div className="penalty-component">
            <div className="row container">
                <div className="small-3 columns icon">
                    <img src="/img/icon-penalty.png" />
                </div>
                <div className="small-9 columns title"><p>Penalty: +1 seconds</p></div>
            </div>
        </div>
    )
}

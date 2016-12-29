const React = require('react')

module.exports = (props)=> {

    return (
        <div className="penalty-component">
            <div className="row container">
                <div className="small-4 columns icon">
                    <img src="/img/icon-penalty.png" />
                </div>
                <div className="small-8 columns title"><p>Penalty: +1 seconds</p></div>
            </div>
        </div>
    )
}

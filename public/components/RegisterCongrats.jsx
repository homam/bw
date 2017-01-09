const React = require('react')

module.exports = React.createClass({

    render() {
        const {name, contest_image} = this.props.contestItem

        return (
            <div className="register-congrats-component">

                <div className="row">
                    <img src="/img/congrats.png" />
                    <p>You have unlocked the:</p>
                </div>

                <div className="row contest-info-container">
                    <div className="contest-image" style={{backgroundImage: `url('${contest_image}')`}} />
                    <div className="info">
                        <p className="title">{name}</p>
                        <p className="info">Cash prize</p>
                    </div>
                </div>

                <div className="row">
                    <a href="javascript:void(0)" className="button" onClick={this.props.onClick}>Play Now</a>
                </div>

                <div className="row">
                    <a href="javascript:void(0)" className="button grey">View Leaderboard</a>
                </div>
            </div>
        )
    }
})

const React = require('react')
const Loading = require('./Loading.jsx')

module.exports = React.createClass({

    handleSubmit(event) {
        this.props.onSubmit(this.input.value)
        event.preventDefault();
    }

    , render() {
        const {name, contest_image} = this.props.contestItem
        const loading = this.props.loading

        return (
            <div className="number-entry-component">

                <div className="row contest-info-container">
                    <div className="contest-image" style={{backgroundImage: `url('${contest_image}')`}}>
                        <img src="/img/icon-locked.png" />
                    </div>
                    <div className="info">
                        <p className="title">{name}</p>
                        <p className="info">Cash prize</p>
                    </div>
                </div>

                <div className="row">
                    <div className="separator"></div>
                </div>

                <div className="row">
                    <h2>Enter your mobile number to unlock:</h2>
                </div>

                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <input type="number" ref={(input) => this.input = input} />
                    </div>
                    <div className="row">
                        <button className="button">{loading ? <Loading/> : 'Continue'}</button>
                    </div>
                </form>

                <div className="row">
                    <p className="error">{this.props.error}</p>
                </div>

                <div className="row">
                    <div className="separator"></div>
                </div>

                <div className="row">
                    <p className="legal">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>
            </div>
        )
    }
})

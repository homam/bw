const React = require('react')

module.exports = React.createClass({

    handleSubmit(event) {
        this.props.onSubmit(this.input.value)
        event.preventDefault();
    }

    , render() {
        return (
            <div className="pin-entry-component">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Pin:
                        <input type="text" ref={(input) => this.input = input} />
                    </label>
                    <input type="submit" value="Verify" />
                </form>
            </div>
        )
    }
})

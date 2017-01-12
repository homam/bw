const React = require('react')
const {Link} = require('react-router')

module.exports = (props:{isAuthenticated: boolean, toggleMenu: () => any})=> {

    return (
    <div className="menu-component">
        <div className="row close-container" onClick={props.toggleMenu}>
            <div><a className="right-off-canvas-toggle" href="#">Close</a></div>
            <i className="icon-close"></i>
        </div>

        <div className="logo-container">
            <img src="/img/bigwin-logo.png" />
        </div>
        <div className="nav">
            <div className="row">
                <i className="icon-game"></i>
                <div><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Games</a></div>
            </div>

            {props.isAuthenticated &&
            <div className="row">
                <i className="icon-profile"></i>
                <div><Link className="right-off-canvas-toggle" to="/profile" onClick={props.toggleMenu}>Profile</Link></div>
            </div>
            }
            {props.isAuthenticated &&
            <div className="row">
                <i className="icon-transaction"></i>
                <div><a className="right-off-canvas-toggle active" href="#" onClick={props.toggleMenu}>Transactions</a></div>
            </div>
            }

            <div className="row">
                <i className="icon-feedback"></i>
                <div><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Feedback</a></div>
            </div>
            <div className="row">
                <i className="icon-about"></i>
                <div><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>About</a></div>
            </div>
        </div>
    </div>
    )
}

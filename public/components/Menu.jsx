const React = require('react')
const {Link} = require('react-router')

module.exports = (props:{toggleMenu: () => any})=> {

    return (<div className="menu-component">
      <ul>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Games</a></li>
        <li><Link className="right-off-canvas-toggle" to="/profile" onClick={props.toggleMenu}>Profile</Link></li>
        <li><a className="right-off-canvas-toggle active" href="#" onClick={props.toggleMenu}>Transactions</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Your High Scores</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Feedback</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>About</a></li>
      </ul>
    </div>
    )
}

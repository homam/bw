const React = require('react')

module.exports = (props:{toggleMenu: () => any})=> {

    return (<div className="menu-component">
      <ul>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Games</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Profile</a></li>
        <li><a className="right-off-canvas-toggle active" href="#" onClick={props.toggleMenu}>Transactions</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Your High Scores</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>Feedback</a></li>
        <li><a className="right-off-canvas-toggle" href="#" onClick={props.toggleMenu}>About</a></li>
      </ul>
    </div>
    )
}

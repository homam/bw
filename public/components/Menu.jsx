const React = require('react')

module.exports = (props)=> {

    return (<div className="menu-component">
      <ul>
        <li><a className="right-off-canvas-toggle" href="#">Games</a></li>
        <li><a className="right-off-canvas-toggle" href="#">Profile</a></li>
        <li><a className="right-off-canvas-toggle active" href="#">Transactions</a></li>
        <li><a className="right-off-canvas-toggle" href="#">Your High Scores</a></li>
        <li><a className="right-off-canvas-toggle" href="#">Feedback</a></li>
        <li><a className="right-off-canvas-toggle" href="#">About</a></li>
      </ul>
    </div>
    )
}

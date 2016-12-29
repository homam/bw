const React = require('react')

module.exports = (props)=> {

    return (<div className="menu-component">
        <div className="right-off-canvas-menu">
            <ul>
              <li><a href="#">Games</a></li>
              <li><a href="#">Profile</a></li>
              <li><a className="active" href="#">Transactions</a></li>
              <li><a href="#">Your High Scores</a></li>
            </ul>

            <ul>
              <li><a href="#">Feedback</a></li>
              <li><a href="#">About</a></li>
            </ul>
        </div>
    </div>
    )
}

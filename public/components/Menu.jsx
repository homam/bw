// @flow

import React from 'react'
import {Link} from 'react-router'
import R from 'ramda'

const constructClassName = (currentRoute: string, route: string)=>
    "right-off-canvas-toggle" + (route == currentRoute ? " active" : "")


module.exports = (props:{isAuthenticated: boolean, currentRoute: string, toggleMenu: () => any})=> {
    const {isAuthenticated, currentRoute, toggleMenu} = props

    const constructClass = R.curry(constructClassName)(currentRoute)

    return (
    <div className="menu-component">
        <div className="row close-container" onClick={toggleMenu}>
            <div><a className="right-off-canvas-toggle" href="#">Close</a></div>
            <i className="icon-close"></i>
        </div>

        <div className="logo-container">
            <img src="/img/bigwin-logo.png" />
        </div>
        <div className="nav">
            <div className="row">
                <i className="icon-game"></i>
                <div><a className={constructClass('/')} href="#" onClick={toggleMenu}>Games</a></div>
            </div>

            {isAuthenticated &&
            <div className="row">
                <i className="icon-profile"></i>
                <div><Link className={constructClass('/profile')} to="/profile" onClick={toggleMenu}>Profile</Link></div>
            </div>
            }
            {isAuthenticated &&
            <div className="row">
                <i className="icon-transaction"></i>
                <div><a className={constructClass('/transaction')} href="#" onClick={toggleMenu}>Transactions</a></div>
            </div>
            }

            <div className="row">
                <i className="icon-feedback"></i>
                <div><a className={constructClass('/feedback')} href="#" onClick={toggleMenu}>Feedback</a></div>
            </div>
            <div className="row">
                <i className="icon-about"></i>
                <div><a className={constructClass('/about')} href="#" onClick={toggleMenu}>About</a></div>
            </div>
        </div>
    </div>
    )
}

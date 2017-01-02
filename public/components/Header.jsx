// @flow
const React = require('react')
const {Link} = require('react-router')

module.exports = (props:{routeName: string, toggleMenu: () => any})=> {
    return (
        <div className="header-component">
            <div className="logo" />

            <nav className="top-bar" data-topbar role="navigation">
                {props.routeName != "home" && <Link to={`/`} className="menu-back"><img src="/img/icon-back.png" /></Link>}
                <a href="javascript:void(0)" onClick={props.toggleMenu} className="menu-icon"><img src="/img/icon-menu.png" /></a>
            </nav>
        </div>
    )
}

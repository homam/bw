const React = require('react')
const {Link} = require('react-router')

module.exports = (props:{routeName: string})=> {

    return (
        <div className="header-component">
            <div className="logo" />

            <nav className="top-bar" data-topbar role="navigation">
                {props.routeName != "home-route" && <Link to={`/`}><img src="/img/icon-back.png" /></Link>}
                <a href="javascript:void(0)" className="right-off-canvas-toggle menu-icon"><img src="/img/icon-menu.png" /></a>
            </nav>
        </div>
    )
}

const React = require('react')
const {Link} = require('react-router')

module.exports = (props:{routeName: string})=> {

    return (
        <div className="header-component">
            <div className="logo" />

            <nav className="top-bar" data-topbar role="navigation">
                {props.routeName != "home-route" && <Link to={`/`}><img src="/img/icon-back.png" /></Link>}
                <a href="javascript:void(0)" onClick={() => {
                  console.log('click')
                  $('.right-off-canvas-menu').foundation('offcanvas', 'show', 'move-left')
                  $('.off-canvas-wrap').css({"overflow-y": 'hidden'})
                }} className="menu-icon"><img src="/img/icon-menu.png" /></a>
            </nav>
        </div>
    )
}

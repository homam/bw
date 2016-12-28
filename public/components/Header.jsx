const React = require('react')
const {Link} = require('react-router')

module.exports = (props:{routeName: string})=> {

    return (
        <div className="header-component">
            <div className="logo" />

            <nav className="top-bar" data-topbar role="navigation">
                <ul className="title-area">
                    <li className="name">
                        {props.routeName != "home-route" && <Link to={`/`}><img src="/img/icon-back.png" /></Link>}
                    </li>
                </ul>
            </nav>
        </div>
    )
}

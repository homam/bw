const React = require('react')
const R = require('ramda')

module.exports = (props: {progress: number, totalBullets: number})=> {
    const {progress, totalBullets} = props
    const currentBullet = (totalBullets) * progress / 100

    return (
        <div className="bullet-bar-component">
            {R.map((it)=> {
                return <div key={it} className={("bullet " + (it <= currentBullet ? "active" : ""))}></div>
            })(R.range(0, totalBullets))}
        </div>
    )
}

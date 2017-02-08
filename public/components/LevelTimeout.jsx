// @flow

const React = require('react')
const Loading = require('./Loading.jsx')

module.exports = (props: {level: number, loading: boolean, onClick: ()=> any})=> {
    const {level, onClick, loading} = props

    return (
        <div className="level-timeout-component">
            <div className="row">
                <h1>Time's up!</h1>
            </div>

            <div className="row">
                <p>You need to do better to go to the next level!</p>
            </div>

            <a href="javascript:void(0)" onClick={() => onClick()} className="button round">
                {loading ? <Loading/> : `Retry level ${level}`}
            </a>
        </div>
    )
}

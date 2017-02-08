// @flow

const React = require('react')
const Loading = require('./Loading.jsx')
const {pluralize} = require('../modules/utils')

module.exports = (props: {level: number, totalLevels: number, loading: boolean, onClick: ()=> any})=> {
    const {level, totalLevels, onClick, loading} = props
    const levelsLeft = totalLevels - level

    return (
        <div className="level-complete-component">
            <div className="row">
                <h1>Level {level} Complete!</h1>
            </div>

            <div className="row">
                <p>Well done!</p>
                <p>You are {levelsLeft} {pluralize(levelsLeft, 'level')} away from winning!</p>
            </div>

            <a href="javascript:void(0)" onClick={() => onClick()} className="button round">
                {loading ? <Loading/> : `Start level ${level + 1}`}
            </a>
        </div>
    )
}

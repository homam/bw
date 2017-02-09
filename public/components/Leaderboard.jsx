// @flow
const React = require('react')
const R = require('ramda')
import type {LeaderboardItem} from "../../types.js"

type LeaderboardItemProp = {item : LeaderboardItem }
type LeaderboardProp = {board: Array<LeaderboardItem> }

const pad = (v, p) => {
  const t = v.toString()
  const d = R.range(0, p - t.length).map(_ => '0').reduce((a, b) => a + b, '')
  return d + t
}

const formatTime = t => {
  const m  = Math.floor(t / 60000)
  const s  = Math.floor( (t - m * 60000) / 1000)
  const ms = Math.floor( (t - m * 60000 - s * 1000) )
  return `${pad(m, 2)}:${pad(s, 2)}.${pad(ms, 3)}`
}

const LeaderboardItemElem = ({item: {full_name, score, position, current_user, highlight}} : LeaderboardItemProp) => {
  return <div className={'leader-board-item' + (!!highlight ? ' me': '')}>
     <span className='rank'>{position}</span>
     <span className='name'>{R.trim(full_name)}</span>
     <span className='time'>{formatTime(score)}</span>
  </div>
}

module.exports = ({board} : LeaderboardProp) => {
  return <div className='leader-board'>{R.zip(R.range(0, board.length), board).map(([i, bi]) => {
    return <LeaderboardItemElem item={bi} key={i} />
  })}</div>
}

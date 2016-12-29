// @flow
const React = require('react')
const R = require('ramda')

type LeaderboardItemType = {rank: number, name: string, time: number, me: ?bool}
type LeaderboardItemProp = {item : LeaderboardItemType }
type LeaderboardProp = {board: [LeaderboardItemType] }

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

const LeaderboardItem = ({item: {rank, name, time, me}} : LeaderboardItemProp) => {
  return <div className={'leader-board-item' + (!!me ? ' me': '')}>
     <span className='rank'>{rank}</span>
     <span className='name'>{name}</span>
     <span className='time'>{formatTime(time)}</span>
  </div>
}

module.exports = ({board} : LeaderboardProp) => {
  return <div className='leader-board'>{R.zip(R.range(0, board.length - 1), board).map(([i, bi]) => {
    return <LeaderboardItem item={bi} key={i} />
  })}</div>
}

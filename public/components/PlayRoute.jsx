 // @flow

const React = require('react')
const R = require('ramda')
const moment = require('moment')
const {getContestQuiz} = require('../modules/apis')
import type {QuestionItem} from "../../types.js";

const ContestInfo = require('./ContestInfo.jsx')
const Question = require('./Question.jsx')


module.exports = React.createClass({

    render() {

        const currentQuestion = R.head(this.state.questions)

        const QuestionElem = ((question)=> {
            if (!question) {
                return []
            }

            const {option_type, options, title} = question
            const QuestionElem = <Question optionType={option_type} options={options} title={title} />

            return QuestionElem
        })(currentQuestion)


        return (<div className="play-route">
            <ContestInfo time={this.state.startingTime} />
            {QuestionElem}
        </div>)
    }

    , getInitialState()  {

        const {contestId} = this.props.routeParams

        const initialState: {
            contestId: number
            , questions: Array<QuestionItem>
            , startingTime: number
        } = {
            contestId: parseInt(contestId)
            , questions: []
            , startingTime: 0
        }

        return initialState
    }

    , componentDidMount() {

        getContestQuiz(this.state.contestId, 0)
        .then((question)=> {
            this.setState({questions: R.append(question, this.state.questions)})
        })

    }
})

// @flow

const React = require('react')
const R = require('ramda')
const {getContestQuiz} = require('../modules/apis')
import type {QuestionItem} from "../../types.js";

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
            {QuestionElem}
        </div>)
    }

    , getInitialState()  {
        const {contestId} = this.props.routeParams

        const initialState: {
            contestId: number
            , questions: Array<QuestionItem>
        } = {
            contestId: parseInt(contestId)
            , questions: []
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

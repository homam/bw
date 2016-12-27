// @flow

const React = require('react')
const R = require('ramda')
const {getContestQuiz} = require('../modules/apis')
import type {Question} from "../../types.js";


module.exports = React.createClass({

    render() {
        console.log(this.state.questions)
        return <div>Plaay</div>
    }

    , getInitialState()  {
        const initialState: {
            questions: Array<Question>
        } = {
            questions: []
        }

        return initialState
    }

    , componentDidMount() {
        getContestQuiz(174, 0)
        .then((question)=> {
            this.setState({questions: R.append(question, this.state.questions)})
        })

    }
})

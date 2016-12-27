// @flow

export type QuizPayload = {
    contest_id: number
    , options_limit: number
    , question_number: number
}

export type AnswerPayload = {
    contest_id: number
    , question_id: number
    , question_number: number
    , answer: string
}

export type ContestItem = {
    contest_id: number
    , name: string
    , best_time: number | null
    , contest_image: string
    , time_remaining: number
}

export type OptionItem = {
    title: string
    , description: string
}

export type Question = {
    title: string
    , options: Array<OptionItem>
    , option_type: string
    , question_id: number
    , total_questions: number
    , question_number: number
    , contest_id: number
}

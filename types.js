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
    contestId: number
    , name: string
    , bestTime: number | null
    , contestImage: string
    , timeRemaining: number
}

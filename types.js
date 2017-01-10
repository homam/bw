// @flow

export type GrantType = 'client_credentials' | 'password' | 'email_access_token'

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

export type RegistrationPayload = {
    msisdn: string
    , contest_id: number
    , publisherid: string
}

export type SubscriptionPayload = {
    contest_id: number
    , publisherid: string
}

export type PinPayload = {
    msisdn: string
    , contest_id: number
    , pincode: number
}

export type ContestItem = {
    contest_id: number
    , name: string
    , best_time: number | null
    , contest_image: string
    , time_remaining: number
    , unlocked: number
}

export type OptionItem = {
    title: string
    , description: string
}

export type QuestionItem = {
    title: string
    , options: Array<OptionItem>
    , option_type: string
    , question_id: number
    , total_questions: number
    , question_number: number
    , contest_id: number
    , _status: {
        answered: boolean
      , isCorrect: ?boolean
      , answer: ?string
      , tapped: ?boolean
    } | null
}

export type Answer = {
    answer_result: string
    , fastest_player: string | boolean
    , is_completed: boolean
    , result_message: string
}

export type Profile = {
    first_name: string
    , telephone: number
}

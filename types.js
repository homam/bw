// @flow

export type GrantType = 'client_credentials' | 'password' | 'email_access_token'

export type QuizPayload = {
    contest_id: number
    , options_limit: number
    , level: number
}

export type AnswerPayload = {
    contest_id: number
    , question_id: number
    , level: number
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
    , game_id: number
    , best_score: ?number
    , contest_image: string
    , time_remaining: number
    , unlocked: boolean
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
    , _status: {
        answered: boolean
      , isCorrect: ?boolean
      , answer: ?string
      , tapped: ?boolean
    } | null
}

export type LevelItem = {
    contest_id: number
    , level: number
    , questions: Array<QuestionItem>
    , total_levels: number
    , total_questions: number
    , total_time_elapsed: number
    , level_time_available: number
}

export type Answer = {
    is_correct: boolean
    , is_contest_complete: string
    , is_level_complete: boolean
    , total_time_elapsed: number
    , level_time_elapsed: number
    , total_time_available: number
}

export type Profile = {
    first_name: string
    , username: number
}

export type TimerState = 'pause' | 'start' | 'restart' | null

export type LeaderboardItem = {
    full_name: string
    , score: number
    , position: number
    , current_user: boolean
    , highlight: boolean
}

export type LeaderboardType = {
    contest: ContestItem
    , leaderboard: Array<LeaderboardItem>
}

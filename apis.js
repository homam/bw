// @flow

import type {GrantType} from './types'
const axios = require('axios')


const generateAccessToken = (url: string, payload: {grant_type: GrantType, client_id: string, client_secret: string})=>
    axios({
        method: 'post'
        , url: url
        , data: payload
    })


module.exports.generateAccessToken = generateAccessToken

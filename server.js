// @flow

const express = require('express')
const config = require('./config')
const port = process.env.PORT || config.port
const httpProxy = require('http-proxy')
const cookieParser = require('cookie-parser')
const apiProxy = httpProxy.createProxyServer({changeOrigin: true});
const {generateAccessToken} = require('./apis')

const {clientId, clientSecret, apiDomain} = config

apiProxy.on('proxyRes', function (proxyRes, req, res) {
  // console.log(req)
  // console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, null, 2));
});

const app = express()
app.use(cookieParser())

const authentication = (req, res, next)=> {
    const {access_token} = req.cookies

    // user has already received access token
    if (!!access_token)
        return next()

    // @TODO: in case of header enrichment, create user account and generate auth token by loggin in
    // receive new anonymouse access token
    generateAccessToken(`${apiDomain}/api/user/access_token/user`, {grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret})
    .then(({data})=> {
        const {access_token, token_type, expires_in} = data.data
        res.cookie('access_token', access_token, {expires: new Date(expires_in * 1000)})
        next()
    })
    .catch(()=> next())
}

app.get('/', authentication, (req, res, next)=> {
    next()
})

app.use(express.static('./public'))

app.all('/api/*', (req, res) => {
  apiProxy.web(req, res, {target: 'https://prizefrenzy.com/'})
})

app.listen(port, ()=> console.log(`listening to port: ${port}`))

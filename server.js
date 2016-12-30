// @flow

const express = require('express')
const config = require('./config')
const port = process.env.PORT || config.port
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer({changeOrigin: true});

apiProxy.on('proxyRes', function (proxyRes, req, res) {
  // console.log(req)
  // console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, null, 2));
});

const app = express()

app.use(express.static('./public'))
app.all('/api/*', (req, res) => {
  apiProxy.web(req, res, {target: 'https://prizefrenzy.com/'})
})

app.listen(port, ()=> console.log(`listening to port: ${port}`))

'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var debug = require('debug')('learnkoa');

var koa = require('koa');
var cors = require('kcors');

var forceSSL = require('koa-force-ssl');
var serve = require('koa-static');
var fs = require('fs');
var https = require('https');
var router = require('koa-router')();
var proxy = require('koa-http-proxy');

// Load config koa
var config = require(__dirname + '/config.js');

var app = koa();

app.use(cors());

app.use(forceSSL('443', 'localhost', true));
debug('redirect', '3001');

// or use absolute paths
app.use(serve(__dirname + '/public'));


if (!module.parent) app
  .use(router.routes(app))
  .use(router.allowedMethods());


router.get('/api/v1/*', proxy({
  target: 'https://dealerportaltest/',
  secure: false
}));

app.listen(config.koa.port);
console.log('Listening on port ' + config.koa.port);

// SSL options
var options = {
  key: fs.readFileSync('private/privatekey.pem', 'utf8'),
  cert: fs.readFileSync('private/certificate.pem', 'utf8')
};

https.createServer(options, app.callback()).listen(443);
console.log('Listening on port ' + '443');

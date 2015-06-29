'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var koa = require('koa');

var forceSSL = require('koa-force-ssl');
var serve = require('koa-static');
var fs = require('fs');
var https = require('https');
var router = require('koa-router')();
var proxy = require('koa-http-proxy')

// Load config koa
var config = require(__dirname + "/config.js");

var app = koa();

app.use(forceSSL(config.koa['https-port']));

// or use absolute paths
app.use(serve(__dirname + '/public'));


app.use(router.routes(app));

router.get('/api/v1/sessions', proxy({
	target: 'https://dealerportaltest/api/v1/users/login',
	secure: false
}));

app.listen(config.koa.port);
console.log('Listening on port ' + config.koa.port);

// SSL options
var options = {
    key: fs.readFileSync('private/www.commander.com.key'),
    cert: fs.readFileSync('private/www.commander.com.cert')
}

https.createServer(options, app.callback()).listen(config.koa['https-port']);
console.log('Listening on port ' + config.koa['https-port']);
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

app.use(forceSSL());

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
    key: fs.readFileSync('private/privatekey.pem'),
    cert: fs.readFileSync('private/certificate.pem')
}

https.createServer(options, app.callback()).listen(443);
console.log('Listening on port ' + '443');
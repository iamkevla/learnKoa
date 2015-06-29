'use strict';

var forceSSL = require('koa-force-ssl');
var serve = require('koa-static');
var koa = require('koa');
var fs = require('fs');
var https = require('https');

var app = koa();

app.use(forceSSL());

// or use absolute paths
app.use(serve(__dirname + '/public'));

app.listen('3000');

// SSL options
var options = {
  key: fs.readFileSync('private/www.commander.com.key'),
  cert: fs.readFileSync('private/www.commander.com.cert')
}

https.createServer(options, app.callback()).listen('443');

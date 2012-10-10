/*!
 * nb - lib/client.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var urlparse = require('url').parse;


function Client(options) {
  options = options || {};
  this.api = options.api || 'http://upload.cnodejs.net/send';
  this.apiOptions = urlparse(this.api);
}

Client.prototype.pipe = function (auth, headers, stream, query, callback) {
  var options = {
    host: this.apiOptions.host,
    path: this.apiOptions.path + '?' + query,
    port: this.apiOptions.port,
    headers: headers,
    method: 'POST'
  };
  if (auth) {
    options.auth = auth;
  }
  var req = http.request(options);
  req.on('response', function (res) {
    var chunks = [];
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
    res.on('end', function () {
      var data = Buffer.concat(chunks);
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = { error: data.toString() };
      }
      callback(null, data);
    });
  });
  stream.on('data', function (data) {
    req.write(data);
  });
  stream.on('end', function () {
    req.end();
  });
};

Client.prototype.send = function (file, auth, params, callback) {
  var query = querystring.stringify(params);
  var stream = fs.createReadStream(file);
  var stat = fs.statSync(file);
  var headers = {
    'Content-Length': '' + stat.size
  };
  this.pipe(auth, headers, stream, query, callback);
};

module.exports = Client;
Client.create = function () {
  return new Client();
};

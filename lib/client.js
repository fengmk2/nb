/*!
 * nb - lib/client.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var urllib = require('urllib');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');


function Client(options) {
  options = options || {};
  this.api = options.api || 'http://upload.cnodejs.net/send';
}

Client.prototype.send = function (file, auth, params, callback) {
  var url = this.api;
  params = params || {};
  if (!params.name) {
    params.name = path.basename(file);
  }

  url += '?' + querystring.stringify(params);
  var content = fs.readFileSync(file);
  var args = {
    content: content,
    type: 'POST',
  };
  if (auth) {
    args.auth = auth;
  }
  urllib.request(url, args, function (err, data) {
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = { error: data.toString() };
      }
    }
    callback(err, data);
  });
};

module.exports = Client;
Client.create = function () {
  return new Client();
};
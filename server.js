#!/usr/bin/env node

'use strict';

var server = require('./app');
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
var express = require('express');
var app = express();
var expressBrowserify = require('express-browserify');

// allows environment properties to be set in a file named .env
require('dotenv').load({silent: true});

server.use(express.static(__dirname + '/static'));

// set up express-browserify to serve bundles for examples
var isDev = server.get('env') === 'development';
server.get('/bundle.js', expressBrowserify('static/browserify-app.js', {
  watch: isDev,
  debug: isDev
}));
server.get('/audio-video-deprecated/bundle.js', expressBrowserify('static/audio-video-deprecated/audio-video-app.js', {
  watch: isDev,
  debug: isDev
}));


// token endpoints
// **Warning**: these endpoints should be guarded with additional authentication & authorization for production use
server.use('/api/speech-to-text/', require('./stt-token.js'));
server.use('/api/text-to-speech/', require('./tts-token.js'));
server.listen(port, function() {
  console.log('Server running on port: %d', port);
});

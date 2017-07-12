'use strict';

// Module Dependencies
var express = require('express'),
        fs = require('fs'),
        http = require('http'),
        https = require('https');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'local';
var config = require('./config/config');

var app = express();

// Setup Models

var models = require(_root + '/app/models');
models.sequelize.sync({alter: true}).then(function () {
    console.log('sequelize syncronized!!!');
});




// Configuration
require('./config/express')(app, models);

// Start the application
app.listen(config.port);
console.log('run node server');


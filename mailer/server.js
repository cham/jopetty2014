'use strict';
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/mailRoutes');
var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', routes);
app.set('port', process.env.PORT || 3025);

module.exports = app;

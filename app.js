var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/constants');
const router = require('./config/router');

mongoose.connect(config.db[process.env.NODE_ENV].url);

//Local configs
require('./config/passport');
const { notFound } = require('./utils/middleware');


const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize())

//Loads routes to app
router(app);

app.use(notFound);

module.exports = app;

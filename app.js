'use strict';

if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    require('dotenv').config();
}


const
    express = require('express'),
    Promise = require('bluebird'),
    bParser = require('body-parser'),
    log4js = require('log4js'),
    MongoClient = require('mongodb').MongoClient,
    app = express(),
    log = require('./helpers/logger').getLogger('APP');

const
    port = process.env.PORT || 3000,
    env = process.env.NODE_ENV || 'development',
    DBURL = process.env.DBURL;

let DB, routes;

app.set('port', port);
app.set('env', env);


Promise.config({
    warnings: true,
    longStackTraces: true,
    cancellation: true,
    monitoring: true
});

console.log('the url ' + DBURL);

MongoClient.connect(DBURL, {promiseLibrary: Promise}).then(db => {
    console.log(`Successfully connected to ${DBURL}`);
    DB = db;
    return DB;
}).then(DB => {
    routes = require('./routes/routes')(DB);
    //console.log("something " + routes);
    app.use('/api', routes);
}).catch(err => {
    console.log(`There was an error connecting to: ${DBURL}`);
    return console.error(err);
});

process.on('SIGTERM', () => {
    console.log('dBase connection closed due to app termination');
    return DB.close();
});

 app.use(log4js.connectLogger(log, { level: 'auto' }));
 app.use(bParser.json());
 app.use(bParser.urlencoded({extended: true}));
 app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
     if(req.method == 'OPTIONS') {
         res.status(200).end();
     }
     else {
         next();
     }
 });


app.get('/test', (req, res) => {
   return res.status(200).json('OK');
});

module.exports = app;

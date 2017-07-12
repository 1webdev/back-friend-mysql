'use strict';
/**
 * Routing
 * Setup request routing
 */

//var debug = require('debug')('rest-api:request');

module.exports = function (app, db) {

    // Allow all domains
    app.use(function (req, res, next) {

        var allowedMethods = [
            'GET', 'POST', 'OPTIONS',
            'PUT', 'PATCH', 'DELETE',
        ];

        var allowedHeaders = [
            'Origin',
            'Accept',
            'Content-Type',
            'x-access-token',
            'X-Access-Token',
            'X-Requested-With',
            'X-HTTP-Method-Override',
        ];

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', allowedMethods.join(', '));
        res.header('Access-Control-Allow-Headers', allowedHeaders.join(', '));
        res.header('Access-Control-Allow-Credentials', true);

        //debug('remoteAddress: ', req.connection.remoteAddress);
        //debug('x-forwarded-for: ', req.headers['x-forwarded-for']);

        //debug('req.method: ', req.method);
        if (req.method === 'OPTIONS')
            return res.send();

        next();
    });


    // ==== Process Routes ====

    // Routes handling static assets
    //require(_root + '/config/routes/static')(app);

    // Routes handling api requests
    require(_root + '/config/routes/api')(app, db);
    require(_root + '/config/routes/front')(app, db);
};

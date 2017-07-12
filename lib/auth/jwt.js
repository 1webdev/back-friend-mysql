'use strict';

var debug = require('debug')('rest-api:lib:jwt'),
    chalk = require('chalk');

var BPromise = require('bluebird');
BPromise.promisifyAll(require('jsonwebtoken'));

var config = require(_root + '/config'),
    getRequestToken = require(_root + '/lib/auth/get-request-token'),
    jwt = require('jsonwebtoken');

module.exports.sign =
function signJwt(data) {
    var options = {};

    if (config.tokens) {
        if (config.tokens.issuer)
            config.issuer = config.tokens.issuer;

        if (config.tokens.algorithm)
            config.algorithm = config.tokens.algorithm;

        if (config.tokens.expiresInMinutes)
            options.expiresInMinutes = config.tokens.expiresInMinutes;
        else if (config.tokens.expiresInSeconds)
            options.expiresInSeconds = config.tokens.expiresInSeconds;
    }

    return jwt.sign(data, config.secret, options);
};

module.exports.mw = {};

/**
 * Verify a jwt
 */
module.exports.mw.verifier =
function jwtVerifier(req, res, next) {
    debug('x-access-token: ' + chalk.yellow('%s'), req.headers && req.headers['x-access-token']);
    debug('query.token: ' + chalk.yellow('%s'), req.query.token);
    var token = getRequestToken(req);
    var options = {};

    if (config.tokens) {
        if (config.tokens.issuer)
            config.issuer = config.tokens.issuer;

        if (config.tokens.algorithm)
            config.algorithm = config.tokens.algorithm;

        if (config.tokens.expiresInMinutes)
            options.expiresInMinutes = config.tokens.expiresInMinutes;
        else if (config.tokens.expiresInSeconds)
            options.expiresInSeconds = config.tokens.expiresInSeconds;
    }

    jwt
        .verifyAsync(token, config.secret, options)
        .then(function(decodedToken) {
            debug('token: ', decodedToken);
            req.decodedToken = decodedToken;
            
        })
        .catch(function(err) {
            debug('err: ', err);
        })
        .finally(next);
};

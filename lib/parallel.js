'use strict';
var async = require('async');

/**
 * Parallel
 *
 * Run functions, usually middleware, in parallel
 */
var parallel = function parallel(middlewares) {
    return function(req, res, next) {
        async.each(middlewares, function(mw, cb) {
            mw(req, res, cb);
        }, next);
    };
};
parallel.middleware = parallel;

module.exports = parallel;

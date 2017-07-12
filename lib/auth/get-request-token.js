'use strict';

module.exports = function(req) {
    return (req.headers && req.headers['x-access-token']) ||
           (req.query.token);
};

'use strict';
/**
 * API
 * Routes that manage API methods
 */

var config = require(_root + '/config');
var express = require('express');
var appApi = require(_root + '/app/api');
var router = express.Router();

module.exports = function (app, db) {

    router.use(function (req, res, next) {
        res.jsonLog = function (output) {
            res.json(output);
        };
        next();
    });


    router.route('/players').get(appApi.player.getPlayers);
    router.route('/fund').get(appApi.player.fund);
    router.route('/take').get(appApi.player.take);
    router.route('/announceTournament').get(appApi.player.announceTournament);
    router.route('/tournaments').get(appApi.player.getTournaments);
    router.route('/balance').get(appApi.player.balance);
    router.route('/joinTournament').get(appApi.player.joinTournament);
    router.route('/resultTournament').post(appApi.player.resultTournament);



    app.use('/api', router);

}
'use strict';

var Models = require(_root + '/app/models');

exports.getOne = function (req, res, next) {
    var output = {};
    output = {status: 'OK'};
    res.jsonLog(output);
    return null;
}


exports.getPlayers = function (req, res, next) {
    var output = {};
    Models.players.findAll().then(function (result) {
        output = {status: 'OK', players: result};
        res.jsonLog(output);
        return null;
    }).catch(function (err) {

    });
}

exports.fund = function (req, res, next) {
    _validatePlayer(req, res, function () {
        var output = {};
        var playerId = req.query.playerId;
        var points = req.query.points;
        var playerData = {playerId: playerId, points: points};
        Models.players.findOrCreate({where: {playerId: playerId}, defaults: playerData})
                .spread(function (player, created) {
                    if (created) {
                        output = {status: 'OK', message: 'You successfully created new player.'};
                        res.jsonLog(output);
                        return null;
                    }
                    if (player) {
                        playerData.points = parseInt(points) + parseInt(player.points);
                        Models.players.update(playerData, {where: {id: player.id}}).then(function () {
                            output = {status: 'OK', message: 'You successfully updated ' + player.playerId + '!'};
                            res.jsonLog(output);
                            return null;
                        });
                    }
                });
    });
}

exports.take = function (req, res, next) {
    _validatePlayer(req, res, function () {
        var output = {};
        var playerId = req.query.playerId;
        var points = req.query.points;
        Models.players.findOne({
            where: {playerId: playerId}
        }).then(function (player) {
            if (!player) {
                var errors = ['Sorry, this player ID does not exist.'];
                output = {status: 'ERROR', errors: errors};
                res.jsonLog(output);
                return null;
            } else {
                var updateData = {points: parseInt(player.points) - parseInt(points)};
                Models.players.update(updateData, {where: {id: player.id}}).then(function () {
                    output = {status: 'OK', message: 'You successfully take point with ' + player.playerId + '!'};
                    res.jsonLog(output);
                    return null;
                });
            }
        });
    });
}

exports.announceTournament = function (req, res, next) {
    _validateTournament(req, res, function () {
        var output = {};
        var tournamentId = req.query.tournamentId;
        var deposit = req.query.deposit;

        var tournamentData = {tournamentId: tournamentId, deposit: deposit, status: 'opened'};
        Models.tournaments.create(tournamentData).then(function (result) {
            output = {status: 'OK', message: 'You successfully announced tournament!'};
            res.jsonLog(output);
            return null;

        });

    });
}

exports.getTournaments = function (req, res, next) {
    var output = {};
    Models.tournaments.findAll({
        include: [
            {
                model: Models.players2tournaments,
                required: false,
                as: 'tournament'
            },
            {
                model: Models.players,
                required: false,
                as: 'winner'

            }
        ]
    }).then(function (result) {
        output = {status: 'OK', tournaments: result};
        res.jsonLog(output);
        return null;
    }).catch(function (err) {
        console.log(err);
    });
}

exports.balance = function (req, res, next) {
    var output = {};
    var playerId = req.query.playerId || '';
    var errors = [];
    if (!playerId) {
        errors.push['Player Id is required param!'];
        output = {status: 'ERROR', errors: errors};
        res.jsonLog(output);
        return null;
    }

    Models.players.findOne({
        where: {playerId: playerId}
    }).then(function (result) {

        if (result) {
            output = {status: 'OK', playerId: playerId, balance: result.points};
            res.jsonLog(output);
            return null;
        }
        errors.push('Player Id does not exist!');
        output = {status: 'ERROR', errors: errors};
        res.jsonLog(output);
        return null;
    }).catch(function (err) {

    });
}

exports.joinTournament = function (req, res, next) {
    var output = {};
    var playerId = req.query.playerId || '';
    var backerIDs = [];
    var tournamentId = req.query.tournamentId || '';
    /* Checking if backerIDs is array */
    if (req.query.backerId && !Array.isArray(req.query.backerId)) {
        backerIDs.push(req.query.backerId);
    } else {
        backerIDs = req.query.backerId;
    }

    var errors = [];
    if (!playerId) {
        errors.push['Player Id is required param!'];
        output = {status: 'ERROR', errors: errors};
        res.jsonLog(output);
        return null;
    }

    if (!tournamentId) {
        errors.push['Tournament Id is required param!'];
        output = {status: 'ERROR', errors: errors};
        res.jsonLog(output);
        return null;
    }

    Models.tournaments.findOne({
        where: {tournamentId: tournamentId},
        include: [
            {
                model: Models.players2tournaments,
                required: false,
                as: 'tournament'
            }
        ]
    }).then(function (result) {
        if (!result) {
            errors.push('Tournament does not exist!');
            output = {status: 'ERROR', errors: errors};
            res.jsonLog(output);
            return null;
        }

        var tournamentDeposit = result.deposit;
        var tournamentID = result.id;


        Models.players.findOne({
            where: {playerId: playerId}
        }).then(function (player) {

            /* Checking if already joined to tournament */

            var isJoined = false;
            if (result.tournament && result.tournament.length) {
                result.tournament.forEach(function (t, k) {
                    if (t.playerID == player.id) {
                        isJoined = true;
                    }
                });
            }

            if (isJoined) {
                errors.push('You already joined to tournament!');
                output = {status: 'ERROR', errors: errors};
                res.jsonLog(output);
                return null;
            }

            var playersToTournaments = {playerID: parseInt(player.id), tournamentID: parseInt(tournamentID)};

            if (player.points >= tournamentDeposit) {
                var points = parseInt(player.points) - parseInt(tournamentDeposit);

                /* Take Point from player */
                Models.players.update({points: points},
                        {where: {playerId: playerId}});

                /* Joining player to tournament */
                Models.players2tournaments.create(playersToTournaments).then(function (result) {
                    output = {status: 'OK', message: 'You successfully join to tournament!'};
                    res.jsonLog(output);
                    return null;

                });
                /* Checking if player doesn't have points */
            } else if (!player.points) {
                errors.push("You don't have points for join tournament!");
                output = {status: 'ERROR', errors: errors};
                res.jsonLog(output);
                return null;
            } else {
                /* Checking If backer exist */
                if (!backerIDs || !backerIDs.length) {
                    errors.push("You don't have enough points for join tournament!");
                    output = {status: 'ERROR', errors: errors};
                    res.jsonLog(output);
                    return null;
                } else {
                    Models.players.findAll({
                        where: {playerId: {$in: backerIDs}}
                    }).then(function (data) {

                        var countBackers = backerIDs.length;
                        var countPlayers = countBackers + 1;
                        var backerDeposit = tournamentDeposit / countPlayers;

                        /* PlayerIDs - array IDs all players from whom you need to take points */
                        var playerIDs = [];

                        /* Checking if backer have enough points for join tournament  */

                        data.forEach(function (val, key) {
                            var backer = val.dataValues;
                            /* Adding backersIDs to playerIDs  */
                            playerIDs.push(backer.id);
                            if (backer.points < backerDeposit) {
                                errors.push("Player " + backer.playerId + " has insufficient points for back!");
                            }
                        });

                        if (errors && errors.length) {
                            output = {status: 'ERROR', errors: errors};
                            res.jsonLog(output);
                            return null;
                        }

                        /* Multiple insert backers to DB  */

                        var backers = [];
                        playerIDs.forEach(function (backerID) {
                            var backer = {
                                playerID: playersToTournaments.playerID,
                                backerID: backerID,
                                tournamentID: playersToTournaments.tournamentID,
                                points: backerDeposit
                            }
                            backers.push(backer);
                        });

                        Models.backers.bulkCreate(backers);
                        /* Add playerID to playerIDs */
                        playerIDs.push(playersToTournaments.playerID);
                        var whereInIDs = playerIDs.join();
                        var sql = "UPDATE players SET points = points - " + backerDeposit + " WHERE id IN (" + whereInIDs + ");"

                        /* Take Point from players */
                        Models.sequelize.query(sql);

                        /* Joining player to tournament */
                        Models.players2tournaments.create(playersToTournaments).then(function (result) {
                            output = {status: 'OK', message: 'You successfully join to tournament!'};
                            res.jsonLog(output);
                            return null;
                        });
                    });
                }
            }
        });


    }).catch(function (err) {

    });
}

exports.resultTournament = function (req, res, next) {
    var output = {};
    var tournamentId = req.body.tournamentId || '';
    var errors = [];

    if (!tournamentId) {
        errors.push('Tournament Id is required param!');
        output = {status: 'ERROR', errors: errors};
        res.jsonLog(output);
        return null;
    }

    Models.tournaments.findOne({
        where: {tournamentId: tournamentId},
        include: [
            {
                model: Models.players2tournaments,
                required: false,
                as: 'tournament',
                include: [
                    {
                        model: Models.players,
                        as: 'player'
                    }
                ]
            },
            {
                model: Models.backers,
                required: false,
                as: 'backers'
            }
        ]
    }).then(function (result) {

        /* Checking if tournament exist  */
        if (!result) {
            errors.push('Tournament does not exist!');
            output = {status: 'ERROR', errors: errors};
            res.jsonLog(output);
            return null;
        }

        /* Checking if tournament is finished */
        if (result.status == 'finished') {
            errors.push('This Tournament is finished!');
            output = {status: 'ERROR', errors: errors};
            res.jsonLog(output);
            return null;
        }

        var tournamentDeposit = parseInt(result.deposit);
        var tournamentMembers = result.tournament ? result.tournament : [];
        var tournamentMembersCount = tournamentMembers.length ? tournamentMembers.length : 0;
        var backers = result.backers ? result.backers : [];
        var backersCount = backers.length ? backers.length : 0;


        /* Checking if there are enough members for the tournament  */
        if (!tournamentMembersCount || tournamentMembersCount < 2) {
            errors.push('The winner cannot be determined, because are not enough members!');
            output = {status: 'ERROR', errors: errors};
            res.jsonLog(output);
            return null;
        }

        /* Getting random winners and adding points  */
        var winner = _getRandomWinners(tournamentMembers);
        var winnerID = winner.player.id;
        var winnerPlayerId = winner.player.playerId;
        var totalPrize = tournamentDeposit * tournamentMembersCount;

        if (backersCount) {

            var isBacker = false;
            backers.forEach(function (val) {
                if (val.playerID == winnerID) {
                    isBacker = true;
                }
            });

            if (isBacker) {
                var credit = tournamentDeposit / (backersCount + 1);
                var totalCredit = credit * backersCount;
                totalPrize = totalPrize - totalCredit;
                /* Adding points to backers */
                var backerIDs = [];
                backers.forEach(function (backer) {
                    backerIDs.push(backer.backerID);
                });
                var whereInIDs = backerIDs.join();
                var sql = "UPDATE players SET points = points + " + credit + " WHERE id IN (" + whereInIDs + ");"
                Models.sequelize.query(sql);
            }
        }

        /* Adding Points to winner */
        var sql = "UPDATE players SET points = points + " + totalPrize + " WHERE id = " + winnerID + "";
        Models.sequelize.query(sql);

        /* Updating tournament status */
        var updateData = {status: 'finished', winnerID: winnerID};
        Models.tournaments.update(updateData, {where: {id: result.id}}).then(function () {
            output = {status: 'OK', winners: [{playerId: winnerPlayerId, prize: totalPrize}]};
            res.jsonLog(output);
            return null;
        });

    });
}

exports.reset = function (req, res, next) {
    var output = {};
    Models.sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
            .then(function (result) {
                return Models.sequelize.sync({force: true});
            }).then(function () {
        return Models.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }).catch(function (err) {
        res.jsonLog({isError: true, status: err.message});
        return null;
    });

    output = {status: 'OK'};
    res.jsonLog(output);
    return null;
}

function _getRandomWinners(players) {
    var rand = players[Math.floor(Math.random() * players.length)];
    return rand;
}

function _validateTournament(req, res, cb) {
    var errors = [];

    if (!req.query.tournamentId) {
        errors.push('Tournament ID field is required');
    }

    if (!parseInt(req.query.deposit)) {
        errors.push('Deposit field is required');
    }

    if (typeof (parseInt(req.query.deposit)) != 'number') {
        errors.push('Deposit required int value');
    }

    if (errors.length) {
        var response = {status: 'ERROR', errors: errors};
        res.jsonLog(response);
        return null;
    } else {
        cb();
    }

}


function _validatePlayer(req, res, cb) {

    var errors = [];

    if (!req.query.playerId) {
        errors.push('Player ID field is required');
    }

    if (!parseInt(req.query.points)) {
        errors.push('Points field is required');
    }

    if (typeof (parseInt(req.query.points)) != 'number') {
        errors.push('Points required int value');
    }

    if (errors.length) {
        var response = {status: 'ERROR', errors: errors};
        res.jsonLog(response);
        return null;
    } else {
        cb();
    }

}
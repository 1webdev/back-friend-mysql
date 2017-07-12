import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Player} from '../models/player';
import {Tournament} from '../models/tournament';
import {HttpRequestService} from '../services/http-request.service';

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    players: Player[] = [];
    player: Player;

    tournaments: Tournament[] = [];
    tournament: Tournament;

    errors: any = [];
    successMessage: any = [];

    backerPlayers: any = {};

    constructor(private httpRequestSvc: HttpRequestService) {

    }

    ngOnInit(): void {
        this.initPage();
    }

    initPage() {
        this.player = new Player();
        this.tournament = new Tournament();
        this.backerPlayers = {};
        this.getPlayers();
        this.getTournaments();
    }

    getPlayers() {
        this.httpRequestSvc.get('players').then((result: any) => {
            if (result.status == 'OK') {
                this.players = result.players;
            }
        });
    }

    getTournaments() {
        this.httpRequestSvc.get('tournaments').then((result: any) => {
            if (result.status == 'OK') {
                this.tournaments = result.tournaments;
            }
        });
    }

    fund() {
        this._validatePlayer().then((isValid: boolean) => {
            if (isValid) {
                this.httpRequestSvc.get('fund', this.player).then((result: any) => {
                    if (result.status == 'OK') {
                        this.player = new Player();
                        this.getPlayers();
                        this.successMessage.player = result.message;
                        this._hideSuccessMessage('player');
                    }

                    if (result.status == 'ERROR') {
                        this.errors.player = result.errors;
                        this._hideErrors('player');
                        return;
                    }

                }).catch((error: any) => {

                });
            }
        });
    }

    take() {
        this._validatePlayer().then((isValid: boolean) => {
            if (isValid) {
                this.httpRequestSvc.get('take', this.player).then((result: any) => {
                    if (result.status == 'OK') {
                        this.player = new Player();
                        this.getPlayers();
                        this.successMessage.player = result.message;
                        this._hideSuccessMessage('player');
                    }
                    if (result.status == 'ERROR') {
                        this.errors.player = result.errors;
                        this._hideErrors('player');
                        return;
                    }

                }).catch((error: any) => {

                });
            }
        });
    }

    announceTournament() {
        this._validateTournament().then((isValid: boolean) => {
            if (isValid) {
                this.httpRequestSvc.get('announceTournament', this.tournament).then((result: any) => {
                    if (result.status == 'OK') {
                        this.tournament = new Tournament();
                        this.getTournaments();
                        this.successMessage.tournament = result.message;
                        this._hideSuccessMessage('tournament');
                    }
                    if (result.status == 'ERROR') {
                        this.errors.tournament = result.errors;
                        this._hideErrors('tournament');
                    }

                }).catch((error: any) => {

                });
            }
        });
    }

    refreshPoint(playerId: string) {
        this.httpRequestSvc.get('balance', {playerId: playerId}).then((result: any) => {
            if (result.status == 'OK') {
                alert(result.playerId + ' have a ' + result.balance + ' points!');
                return;
            }
            if (result.status == 'ERROR') {
                this.errors.player = result.errors;
                this._hideErrors('player');
            }
        }).catch((error: any) => {

        })

    }

    checkIfCanJoin(tournament: Tournament, player: Player) {
        var playerPoints = player.points;
        var tournamentDeposit = tournament.deposit;

        if (tournament.tournament && tournament.tournament.length) {
            var isShow = true;
            tournament.tournament.forEach((t, k) => {
                if (t.playerID == player.id) {
                    isShow = false;
                }
            });
            if (!isShow) {
                return false;
            }
        }

        if (playerPoints >= tournamentDeposit) {
            return true;
        } else if (this.backerPlayers[tournament.tournamentId] && this.backerPlayers[tournament.tournamentId][player.playerId]) {
            var countBackFriend = this.backerPlayers[tournament.tournamentId][player.playerId]['players'].length;
            if (countBackFriend) {
                var totalBackPlayers = countBackFriend + 1;
                var backerDeposit = tournamentDeposit / totalBackPlayers;
                if (player.points < backerDeposit) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    checkIfCanAskForBackers(tournament: Tournament, player: Player) {

        var playerPoints = player.points;
        var tournamentDeposit = tournament.deposit;

        var isShow = true;

        if (tournament.tournament && tournament.tournament.length) {

            tournament.tournament.forEach((t, k) => {
                if (t.playerID == player.id) {
                    isShow = false;
                }
            });
            if (!isShow) {
                return false;
            }
        }

        if (tournament.backers && tournament.backers.length) {
            tournament.backers.forEach((b) => {
                if (b.backerID == player.id) {
                    isShow = false;
                }
            });

            if (!isShow) {
                return false;
            }
        }

        if (this.backerPlayers[tournament.tournamentId]) {
            return false;
        } else if (tournamentDeposit > playerPoints) {
            return true;
        }
        return false;
    }

    checkIfBackPlayer(tournament: Tournament, player: Player) {
        var tournamentId = tournament.tournamentId;
        var playerId = player.playerId;

        var isShow = true;

        if (this.backerPlayers[tournamentId]) {

            if (!player.points) {
                return false;
            }

            if (tournament.tournament && tournament.tournament.length) {
                tournament.tournament.forEach((t, k) => {
                    if (t.playerID == player.id) {
                        isShow = false;
                    }
                });
            }

            if (!isShow) {
                return false;
            }

            for (let backFriendID in this.backerPlayers[tournamentId]) {
                if (playerId != backFriendID && backFriendID != 'playerId') {
                    var backerPlayers = this.backerPlayers[tournamentId][backFriendID].players;
                    if (backerPlayers.length) {
                        backerPlayers.forEach((backerPlayerId, key) => {
                            if (playerId == backerPlayerId) {
                                isShow = false;
                            }
                        });
                        return isShow;
                    }
                    return true;
                }
            }
        }
        return false;
    }

    askForBackers(tournament: Tournament, player: Player) {

        this.backerPlayers = {};

        if (!this.backerPlayers[tournament.tournamentId]) {
            this.backerPlayers[tournament.tournamentId] = {};
            this.backerPlayers[tournament.tournamentId][player.playerId] = {};
            this.backerPlayers[tournament.tournamentId].playerId = player.playerId;
            this.backerPlayers[tournament.tournamentId][player.playerId].players = [];
        }
    }

    backPlayer(tournament: Tournament, player: Player) {

        if (this.backerPlayers[tournament.tournamentId]) {
            var playerID = this.backerPlayers[tournament.tournamentId].playerId;
            if (this.backerPlayers[tournament.tournamentId][playerID]) {
                this.backerPlayers[tournament.tournamentId][playerID]['players'].push(player.playerId);
            }
        }
    }

    joinTournament(tournament: Tournament, player: Player) {
        var playerId = player.playerId;
        var tournamentId = tournament.tournamentId;
        var params = {};
        if (this.backerPlayers[tournament.tournamentId] && this.backerPlayers[tournament.tournamentId][player.playerId]) {
            var backerIDs = this.backerPlayers[tournament.tournamentId][player.playerId].players;
            params = {tournamentId: tournament.tournamentId, playerId: playerId, backerId: backerIDs};
        } else {
            params = {tournamentId: tournament.tournamentId, playerId: playerId};
        }

        this.httpRequestSvc.get('joinTournament', params).then((result: any) => {

            this.successMessage.joinTournament = {};
            this.successMessage.joinTournament[tournamentId] = result.message;

            if (result.status == 'OK') {
                this.getPlayers();
                this.getTournaments();
                this.backerPlayers = {};
                this.successMessage.joinTournament = {};
                this.successMessage.joinTournament[tournamentId] = result.message;
                this._hideSuccessMessage('joinTournament');
            }
            if (result.status == 'ERROR') {
                this.errors.joinTournament = {};
                this.errors.joinTournament[tournamentId] = result.errors
                this._hideErrors('joinTournament');
                return;
            }
        });
    }


    checkIfAlreadyJoined(tournament: Tournament, player: Player) {
        var isShow = false;
        if (tournament.tournament && tournament.tournament.length) {
            tournament.tournament.forEach((t, k) => {
                if (t.playerID == player.id) {
                    isShow = true;
                }
            });
        }
        return isShow;
    }

    checkIfAlreadyBacker(tournament: Tournament, player: Player) {
        var isShow = false;
        if (tournament.backers && tournament.backers.length) {
            tournament.backers.forEach((b, k) => {
                if (b.backerID == player.id) {
                    isShow = true;
                }
            });
        }
        return isShow;
    }

    checkIfSetWinners(tournament: Tournament) {
        if (tournament.status == 'finished') {
            return false;
        } else if (!tournament.tournament || !tournament.tournament.length || tournament.tournament.length < 2) {
            return false;
        }
        return true;
    }

    resultTournament(tournament: Tournament) {
        var tournamentId = tournament.tournamentId;
        if (!tournamentId) {
            alert('Error, tournament ID is required param!');
            return false;
        }

        this.httpRequestSvc.post('resultTournament', {tournamentId: tournamentId}).then((result: any) => {
            if (result.status == 'OK') {
                alert('Winner: ' + result.winners[0].playerId);
                this.getPlayers();
                this.getTournaments();
            }

            if (result.status == 'ERROR') {
                this.errors.joinTournament = {};
                this.errors.joinTournament[tournamentId] = result.errors
                this._hideErrors('joinTournament');
            }
        });
    }


    resetDB() {
        this.httpRequestSvc.get('reset').then((result: any) => {
            if (result.status == 'OK') {
                setTimeout(() => {
                    this.initPage();
                }, 1000);
            }
        });
    }

    _validateTournament() {
        let promise = new Promise((res, rej) => {
            var isErrorValidate = this.tournament.validate();
            if (isErrorValidate) {
                this.errors.tournament = isErrorValidate;
                this._hideErrors('tournament');
                res(false);
            }
            res(true);
        });
        return promise;
    }

    _validatePlayer() {
        let promise = new Promise((res, rej) => {
            var isErrorValidate = this.player.validate();
            if (isErrorValidate) {
                this.errors.player = isErrorValidate;
                this._hideErrors('player');
                res(false);
            }
            res(true);
        });
        return promise;
    }

    _hideSuccessMessage(messageType: string) {
        setTimeout(() => {
            this.successMessage[messageType] = '';
        }, 3500);
    }

    _hideErrors(errorType: string) {
        setTimeout(() => {
            this.errors[errorType] = [];
        }, 3000);
    }

    _keyPress(event: any) {
        const pattern = /[0-9\.\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.charCode) {
            event.preventDefault();
        }
    }

}

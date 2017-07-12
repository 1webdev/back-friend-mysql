/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Players2Tournaments = sequelize.define('players2tournaments', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        playerID: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: 'players',
                key: 'id'
            }
        },
        tournamentID: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: 'tournaments',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        paranoid: false,
        classMethods: {
            associate: function (models) {
                Players2Tournaments.belongsTo(models.tournaments, {foreignKey: 'tournamentID', as: 'tournament'});
                Players2Tournaments.belongsTo(models.players, {foreignKey: 'playerID', as: 'player'});
                Players2Tournaments.hasMany(models.backers, {foreignKey: 'playerJoinedId', as: 'backers'});
            }
        }

    });

    return Players2Tournaments;
};
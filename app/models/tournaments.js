/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Tournaments = sequelize.define('tournaments', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        tournamentId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        deposit: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('opened', 'finished', 'inProcess'),
            allowNull: true
        },
        winnerID: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true,
            references: {
                model: 'players',
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
                Tournaments.hasMany(models.players2tournaments, {foreignKey: 'tournamentID', as: 'tournament'});
                Tournaments.hasMany(models.backers, {foreignKey: 'tournamentID', as: 'backers'});
                Tournaments.belongsTo(models.players, {foreignKey: 'winnerID', as: 'winner'});
            }
        }
    });

    return Tournaments;
};
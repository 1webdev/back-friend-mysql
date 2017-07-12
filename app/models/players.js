/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    var Players = sequelize.define('players', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        playerId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        points: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
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
                Players.hasMany(models.players2tournaments, {foreignKey: 'playerID', as: 'player'});
            }
        }

    });

    return Players;
};
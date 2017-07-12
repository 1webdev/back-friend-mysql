/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
    var Backers = sequelize.define('backers', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        playerJoinedId: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            references: {
                model: 'players2tournaments',
                key: 'id'
            }
        },
        backerID: {
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
        points: {
            type: DataTypes.INTEGER(11),
            allowNull: true
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
                Backers.belongsTo(models.tournaments, {foreignKey: 'tournamentID', as: 'backers'});
            }
        }

    });

    return Backers;
};

module.exports = function(sequelize, DataTypes) {
    var model = sequelize.define('coinlist', {
        
        Ids: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        Url: {
            allowNull: true,
            type: DataTypes.STRING
        },

        ImageUrl: {
            allowNull: true,
            type: DataTypes.STRING
        },

        Name: {
            allowNull: true,
            type: DataTypes.STRING
        },

        Symbol: {
            allowNull: true,
            type: DataTypes.STRING
        },

        CoinName: {
            allowNull: true,
            type: DataTypes.STRING
        },

        FullName: {
            allowNull: true,
            type: DataTypes.STRING
        },
        Algorithm: {
            allowNull: true,
            type: DataTypes.STRING
        },
        ProofType: {
            allowNull: true,
            type: DataTypes.STRING
        },
        FullyPremined: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        TotalCoinSupply: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        PreMinedValue: {
            allowNull: true,
            type: DataTypes.STRING
        },

        TotalCoinsFreeFloat: {
            allowNull: true,
            type: DataTypes.STRING
        },

        SortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        Sponsored: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        
           
    }, {
        underscored: true,
        freezeTableName: true
    });
    return model;
};
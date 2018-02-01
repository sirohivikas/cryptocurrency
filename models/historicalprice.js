
module.exports = function(sequelize, DataTypes) {
    var model = sequelize.define('historicalprice', {
        
        coinname: {
            allowNull: true,
            type: DataTypes.STRING
        },

        value: {
            allowNull: true,
            type: DataTypes.STRING
        }
           
    }, {
        underscored: true,
        freezeTableName: true
    });
    return model;
};
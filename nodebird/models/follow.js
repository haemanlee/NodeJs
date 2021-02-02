const Sequelize = require('sequelize');

module.exports = class Follow extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
    followingId: {
        type: Sequelize.STRING(30),
        allowNull: true,
        },
    followerId: {
        type: Sequelize.STRING(30),
        allowNull: true,
    },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Follow',
      tableName: 'follow',
      paranoid: false,// hard delete
      charset: 'utf8', //imogi 저장 가능.
      collate: 'utf8_general_ci',
    });
  }
};
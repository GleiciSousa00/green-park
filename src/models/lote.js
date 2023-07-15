const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/databaseConfig.js');

class Lote extends Model {}

Lote.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
  },
  ativo: {
    type: DataTypes.BOOLEAN,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  }
}, {
  sequelize,
  modelName: 'Lote',
  timestamps: false, 
});

module.exports = Lote;

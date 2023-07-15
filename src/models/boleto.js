const { Sequelize, DataTypes, Model } = require('sequelize');
const Lote = require('./lote.js');
const sequelize = require('../../config/databaseConfig.js');

class Boleto extends Model {}

Boleto.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_sacado: {
    type: DataTypes.STRING(255),
  },

  id_lote: {
    type: DataTypes.INTEGER,
    references: {
      model: Lote, 
      key: 'id',
    }
  },
  valor: {
    type: DataTypes.DOUBLE,
  },
  linha_digitavel: {
    type: DataTypes.STRING(255),
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
  modelName: 'Boleto',
});

sequelize.sync();

module.exports = Boleto;
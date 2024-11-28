//imports 
import sequelize from "../config/dataBase.js";
import { DataTypes } from "sequelize";

//criando o model
const Usuario = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    chatid_telegram: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, {
    tableName: 'usuarios',
    timestamps: true,
});


export default Usuario;

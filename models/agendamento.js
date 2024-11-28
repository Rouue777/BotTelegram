//imports
import sequelize from "../config/dataBase.js";
import Usuario from "./usuario.js";
import { DataTypes } from "sequelize";


//criando model
const Agendamento = sequelize.define('agendamentos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    chatid_telegram: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    data_agendamento: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'agendado',
    }

}, {
    tableName: 'agendamentos',
    timestamps: true,
});



export default Agendamento;
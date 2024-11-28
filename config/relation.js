//imports
import Usuario from "../models/usuario.js";
import Agendamento from "../models/agendamento.js";



//criando association
Usuario.hasMany(Agendamento, {
    foreignKey : 'chatid_telegram',
    sourceKey : 'chatid_telegram',
    onDelete : 'CASCADE',
    onUpdate : 'CASCADE',
});

Agendamento.belongsTo(Usuario, {
    foreignKey : 'chatid_telegram',
    targetKey : 'chatid_telegram',
})
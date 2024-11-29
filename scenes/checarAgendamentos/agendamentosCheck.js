//imports 
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciando scene
const agendametoCheck = new Scenes.BaseScene('agendamentoCheck')

//entrada da scene
agendametoCheck.enter(async (ctx) => {
    try{
        await ctx.reply('você escolheu consultar agendamentos')
    }
    catch(erros) {
        console.error('erro no agendamentoCheck ' + erros)
        await ctx.reply('Houve um erro ao consultar ao agendamentos, Tente novamente!')
    }
})



//exportar
export default agendametoCheck;
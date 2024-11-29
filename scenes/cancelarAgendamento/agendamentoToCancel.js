//import
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";


//instanciaar scene
const agendamentoToCancel = new Scenes.BaseScene('agendamentoToCancel');

agendamentoToCancel.enter(async (ctx) => {
    try{
        //mensagem de entrada para cancelar agendamento
        ctx.reply('você escolçheu cancelar agendamento')

    }catch(erros){
        console.error('erro no canclamento de agendamento ' + erros)
        await ctx.reply('Tivemos um problema ao tentar cancelar agendamento, Tente novamente!')
    }
})


//exportar
export default agendamentoToCancel;
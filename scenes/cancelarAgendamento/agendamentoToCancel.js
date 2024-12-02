//import
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";
import { where } from "sequelize";


//instanciaar scene
const agendamentoToCancel = new Scenes.BaseScene('agendamentoToCancel');

agendamentoToCancel.enter(async (ctx) => {
    try{
        //mensagem de entrada para cancelar agendamento
        ctx.reply('Você deseja cancelar algum dos seus agendamentos? 🤔📅\n\n' +
             ' Por favor, informe o agendamento que deseja cancelar. ❌')
        //buscar agendamentos
        const chatIdAtual = ctx.chat.id //pegar chatid

        //buscar agendamentos no db
        const agendamentosLista = await Agendamento.findAll({where:{chatid_telegram: chatIdAtual}})
        //verificar se existem agendamentos
        if(agendamentosLista.length == 0){
         //caso o usuario não possua agendamentos
         
        }
        //exibir agendamento do cliente
        for(let i = 0; i < agendamentosLista.length; i++){
            //exibir lista com indice de cada elemento da lista
            let suporte = agendamentosLista[i]//armazenar objeto
            await ctx.reply(`[ ${i} ] = ${suporte.data_agendamento}`)//exibir objeto em lista

        }
        await ctx.reply("🌟 Selecione o número do agendamento que deseja cancelar: 📅")

    }catch(erros){
        console.error('erro no canclamento de agendamento ' + erros)
        await ctx.reply('Tivemos um problema ao tentar cancelar agendamento, Tente novamente!')
    }
})


//exportar
export default agendamentoToCancel;
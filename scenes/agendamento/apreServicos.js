//import
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciar scene
const apreServicos = new Scenes.BaseScene("apreServicos");

apreServicos.enter( async (ctx) => {
    await ctx.reply('Olá! ' + ctx.session.nome +' Você está a um passo de ter mais comodidade na sua rotina. Com o nosso serviço de agendamento, você pode marcar, alterar ou consultar seus compromissos de forma rápida e prática, tudo pelo WhatsApp')
    await ctx.reply(' Seja para marcar consultas, serviços ou qualquer outro compromisso, nosso sistema é fácil de usar e sempre disponível para você. Vamos tornar o seu dia mais organizado e sem ')
    await ctx.reply('1 2 ou 3') 
})



export default apreServicos;
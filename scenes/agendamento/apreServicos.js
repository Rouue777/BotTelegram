//import
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciar scene
const apreServicos = new Scenes.BaseScene("apreServicos");

//apresentar servicos usando o objeto reply marku para definir a estrutura e inline keyboeard para definir os botoes
//usando callback data para pegar a resposta do cliente qunado obotao e apertado
apreServicos.enter(async (ctx) => {
  // Mensagem de boas-vindas
  await ctx.reply(
    "Olá, " +
      ctx.session.nome +
      '✨ Você está a um passo de ter mais comodidade na sua rotina! 💼\n\n' +
      'Com o nosso serviço de agendamento, você pode:\n' +
      '📅 Marcar compromissos de forma rápida e prática.\n' +
      '🔄 Alterar agendamentos facilmente.\n' +
      '📜 Consultar seus compromissos a qualquer momento.\n\n' +
      'Tudo isso pelo nosso Chat do Telegram! 📲\n\n' +
      'Vamos deixar a sua rotina mais organizada e sem estresse! 😎💬',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "1. Agendar", callback_data: "1" },
            { text: "2. Cancelar Agendamento", callback_data: "2" },
          ],
          [{ text: "3. Checar meus Agendamentos", callback_data: "3" }],
        ],
      },
    }
  );
});

//usar callback query para continuar o fluxo de acordo com resposta do cliente
apreServicos.on('callback_query', async (ctx) => {
   try{ //pegar a data do callbackdata
    const callback  = ctx.callbackQuery.data;

    //criar logica para lidar com opcoes de servico
    //fluxo de agendamento
    if(callback == 1){
        //basicamente mandar para scene de agendamento
        await ctx.reply('você escolheu agendar')
        return ctx.scene.enter('agendar')

    }
    //fluxo de cancelar agendamento
    if(callback == 2){
        //mandar para scene de cancelar agendamento
        return ctx.scene.enter('agendamentoToCancel')
    }
    //fluxo para checar agendamentos
    if(callback == 3){
        //mandar para scene consultar agendamento
        return ctx.scene.enter('agendamentoCheck')
    }
   }catch(erros){
    console.error('Erro ao processar escolha de serviço ' + erros)
    await ctx.reply('Desculpe o transtorno algo deu erradom Tente novamente!')
   }
})

export default apreServicos;

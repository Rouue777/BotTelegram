//imports
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciar scene
const agendar = new Scenes.BaseScene("agendar");

agendar.enter(async (ctx) => {
  // Exibir mensagem organizada com emojis
  await ctx.reply(
    "✨ Ótimo! Vamos agendar o seu compromisso. 🗓️\n\n" +
      "Para facilitar, por favor, me informe a **data e a hora** do seu agendamento. ⏰\n\n" +
      "Use o formato: `AAAA-MM-DD HH:mm`, por exemplo:\n" +
      "📅 YYYY-MM-DD HH:MM:SS / 2024-11-25 15:30:00\n\n" +
      "Fique à vontade para enviar a data e hora do seu compromisso! 😊"
  );
});

//scene para receber, verificar e salvar no banco de dados
agendar.on('text', async (ctx) => {
    try{
  //pegar data e hora
  const agendamentoData = ctx.message.text;
  ctx.session.agendamentoDados = ctx.message.text
  console.log('data que o cliente digitou : ' + agendamentoData)

  //verificação da resposta do cliente
  //verificar formatacao
  if (agendamentoData.length !== 19) {
    await ctx.reply(
      "⚠️ Desculpe mas o formato de entrada da entrada\n" +
        "não é aceito certifique-se de seguir a estrutura YYYY-MM-DD HH:MM:SS"
    );
    return;
  }
  
  //verificar se o formato esta correto com regex
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(agendamentoData)) {
    await ctx.reply(
      "⚠️ Desculpe, mas o formato de data e hora não está correto. garanta que o formato é : YYYY-MM-DD HH:MM:SS"
    );
    return;
  }
  
  //verificar se a data já não existe no banco de dados
  const horarioDB = await Agendamento.findOne({where:{data_agendamento : agendamentoData}});
  if(horarioDB){
    await ctx.reply('Essa data já esta reservada, por favor escolha outra data outra data!')
    ctx.scene.enter('agendar')//retornar para começo dessa scene onde pede a data para agendamento
  return;  
}

  //retornar mensagem para confirmar se o cliente deseja mesmo salvar a data digitada
  await ctx.reply(
    `✅Perfeito! Agora, me confirme: o agendamento é para o dia 📅  ${agendamentoData}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Confirmar", callback_data: "1" },
            { text: "Adiar agendamento", callback_data: "0" }
          ]
        ]
      }
    }
  );
    }catch(erros){
        console.error('erro na verificação ' + erros)
    }
});

//confirmacao de agendamento
agendar.on('callback_query', async (ctx) => {
    try{
    //usar resposta para saber iremos salvar data no banco de dados ou retornar ao inicio
    const callback = ctx.callbackQuery.data

    if(callback == 1){
        //salvar no banco de dados agendamento junto com chatid do usuario atual para poder relacionar o agendamento ai usuario
        const agendamentoSchema = await  Agendamento.create({
            chatid_telegram : ctx.chat.id,
            data_agendamento : ctx.session.agendamentoDados
        })
        

        await ctx.reply(`✅ Seu agendamento foi realizado com sucesso para o dia 📅 ${ctx.session.agendamentoDados}\n\n` +
            'Para voltar ao inicio digite /start'
        )
        ctx.scene.leave()//finalizar cena

    }

    if(callback == 0){
        //retornar para o inicio
        await ctx.reply('Você adiou o agendamento e foi redirecionado para o menu principal!')
        ctx.scene.enter('pegarNome')
    }
}catch(erros){
    console.error('erro ao salvar ' + erros)
    await ctx.reply("❌ Ocorreu um erro ao agendar. Tente novamente mais tarde.");
}
})

//exportar scene
export default agendar;

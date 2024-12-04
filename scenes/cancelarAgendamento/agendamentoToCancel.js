//import
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";
import { where } from "sequelize";

//instanciaar scene
const agendamentoToCancel = new Scenes.BaseScene("agendamentoToCancel");

agendamentoToCancel.enter(async (ctx) => {
  try {
    //verificar se existem agendamentos
    //buscar agendamentos
    const chatIdAtual = ctx.chat.id; //pegar chatid
    //buscar agendamentos no db
    const agendamentosLista = await Agendamento.findAll({
      where: { chatid_telegram: chatIdAtual },
    });
    if (agendamentosLista.length == 0) {
      //caso o usuario não possua agendamentos
      await ctx.reply("Infelizmente você não possui agendamentos!");
      return ctx.scene.enter('apreServicos')
    } else {
      //mensagem de entrada para cancelar agendamento
      ctx.reply(
        "Olá " +
          ctx.session.nome +
          " Você deseja cancelar algum dos seus agendamentos? 🤔📅\n\n" +
          " Por favor, informe o agendamento que deseja cancelar. ❌"
      );

      //exibir agendamento do cliente
      for (let i = 0; i < agendamentosLista.length; i++) {
        //exibir lista com indice de cada elemento da lista
        let suporte = agendamentosLista[i]; //armazenar objeto
        //criar configuracao de formatação da data
        let optionsFormatacao = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        //data formatada com metodo tolocaledatestring
        const agendamentoFormatado =
          suporte.data_agendamento.toLocaleDateString(
            "pt-BR",
            optionsFormatacao
          );

        await ctx.reply(`[ ${i} ] = ${agendamentoFormatado}`); //exibir objeto em lista
      }
      await ctx.reply(
        "🌟 Selecione o número do agendamento que deseja cancelar: 📅"
      );
    }
  } catch (erros) {
    console.error("erro no canclamento de agendamento " + erros);
    await ctx.reply(
      "Tivemos um problema ao tentar cancelar agendamento, Tente novamente!"
    );
  }
});

//entrada do usuario para poder pegar entrada e apagar o agendamento deletado
agendamentoToCancel.on("text", async (ctx) => {
  try {
    //pegar numero digitado pelo cliente
    const numAgendamento = parseInt(ctx.message.text);
    const chatIdAtual = ctx.chat.id;
    //acessar agendamento para buscar lista
    const listaAgendamentos = await Agendamento.findAll({
      where: { chatid_telegram: chatIdAtual },
    });
    //verificação
    if (listaAgendamentos.length == 0) {
      await ctx.reply("Não existem agendamentos para serem apagados");
      return;
    }
    //pegar no db o agendamento correspondente ao digitado pelo cliente no chat
    const agendamentoToDelete = listaAgendamentos[numAgendamento];
    //pegar id do agendamento para poder apagar no banco de dados / salvar em varavel de ambiente para nao precisar pegar toda hora o valor
    ctx.session.idAgendamento = agendamentoToDelete.id;
    //confrimacao para deletar
    ctx.reply(
      "🚨 **Atenção!** 🚨\n\nVocê tem certeza que deseja apagar o agendamento? Após confirmar, não será possível reverter essa ação! ❌",
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Sim", callback_data: "confirmar_apagar" },
              { text: "Voltar ao inicio", callback_data: "inicio" },
            ],
          ],
        },
      }
    );
  } catch (erros) {
    console.error(erros);
    await ctx.reply(
      "Ocorreu um erro ao tentar processar seu pedido. Tente novamente mais tarde."
    );
  }
});

//logica para lidar com a resposta do cliente
agendamentoToCancel.on("callback_query", async (ctx) => {
  try {
    //pegar valor da resposta
    const respostaCliente = ctx.callbackQuery.data;

    if (respostaCliente == "confirmar_apagar") {
      //logica para apagar
      const idAgendamento = ctx.session.idAgendamento;
      //verificar existencia do id
      if (!idAgendamento) {
        await ctx.reply(
          "❌ Não foi possível encontrar o agendamento para deletar."
        );
        return;
      }

      ///buscar agendamento no banco de dados
      const resultadoDeletion = await Agendamento.destroy({
        where: { id: idAgendamento },
      });
      //verificar se so agendamento foi deletado
      if (resultadoDeletion === 1) {
        await ctx.reply("✅ O agendamento foi apagado com sucesso!");
        await ctx.reply('Se precisar de algo digite /start!')
      } else {
        await ctx.reply(
          "❌ Não foi possível apagar o agendamento. Tente novamente. Se precisar de algo digite /start"
        );
      }
      await ctx.scene.leave();
      delete ctx.session.idAgendamento;
    }

    if (respostaCliente == "inicio") {
      //logica para retornar para o inicio
      await ctx.scene.enter("apreServicos");
    }
  } catch (erros) {
    console.error("Deu erro logica de deletar " + erros);
    await ctx.reply(
      "Ocorreu um erro ao tentar processar seu pedido. Tente novamente mais tarde."
    );
  }
});

//exportar
export default agendamentoToCancel;

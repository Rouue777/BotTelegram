//imports
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciando scene
const agendametoCheck = new Scenes.BaseScene("agendamentoCheck");

//entrada da scene
agendametoCheck.enter(async (ctx) => {
  try {
    await ctx.reply(
      "Claro! Vou te mostrar os seus próximos agendamentos 📅✨. Só um momentinho!"
    );
    const idCliente = ctx.chat.id; //pegando id do cliente

    //pegar agendamentos no banco de dados
    const listaAgendamentos = await Agendamento.findAll({
      where: { chatid_telegram: idCliente },
    });

    //verificar se existe agendamentos
    if (listaAgendamentos.length == 0) {
      //logica para caso nao tenham agendamentos
      await ctx.reply("Você não possui agendamentos, deseja fazer algum?", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Sim", callback_data: "sim-agendar" },
              { text: "Não", callback_data: "encerrar" },
            ],
          ],
        },
      });
      return;
    }
    //exibir lista de agendamentos para o cliente
    for (let i = 0; i < listaAgendamentos.length; i++) {
      //exibir lista com indice de cada elemento da lista
      let suporte = listaAgendamentos[i]; //armazenar objeto
      //criar classe de formatação da data
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
      const agendamentoFormatado = suporte.data_agendamento.toLocaleDateString(
        "pt-BR",
        optionsFormatacao
      );

      await ctx.reply(` 📅  = ${agendamentoFormatado}`); //exibir objeto em lista
    }

    await ctx.reply(
      "Esses são seus agendamentos 📅✨\n\n" + "O que deseja fazer agora? 🤔",
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "Fazer agendamento", callback_data: "fazer-agendamento" },
              {
                text: "Cancelar agendamento",
                callback_data: "cancel-agendamento",
              },
              { text: "Só checando mesmo", callback_data: "encerrar" },
            ],
          ],
        },
      }
    );
  } catch (erros) {
    console.error("erro no agendamentoCheck " + erros);
    await ctx.reply(
      "Houve um erro ao consultar ao agendamentos, Tente novamente!"
    );
  }
});

//tratando escolhas do cliente
agendametoCheck.on("callback_query", async (ctx) => {
  //reposta do cliente
  const respostaCliente = ctx.callbackQuery.data;

  if (respostaCliente == "fazer-agendamento") {
    //direcionar para cena de agendar
    await ctx.scene.enter("agendar");
  } else if (respostaCliente == "cancel-agendamento") {
    //direcionar para cancelar agendamento
    await ctx.scene.enter("agendamentoToCancel");
  } else if (respostaCliente == "encerrar") {
    //mensagem de finalizacao e finaliar
    await ctx.reply(
      "Entendemos que você deseja encerrar o serviço. Se precisar de mais alguma coisa no futuro, não hesite em nos procurar! 😊\n\nDigite /start para recomeçar e acessar outros serviços quando necessário."
    );
    await ctx.scene.leave();
  } else if (respostaCliente == "sim-agendar") {
    //direcionar para cena de agendar
    await ctx.scene.enter("agendar");
  } else if (respostaCliente == "não-agendar") {
    //mensagem de finalizacao e finaliar
    await ctx.reply(
      "Entendemos que você deseja encerrar o serviço. Se precisar de mais alguma coisa no futuro, não hesite em nos procurar! 😊\n\nDigite /start para recomeçar e acessar outros serviços quando necessário."
    );
    await ctx.scene.leave();
  }
});

//exportar
export default agendametoCheck;

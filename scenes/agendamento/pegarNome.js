//import
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciar scene
const pegarNome = new Scenes.BaseScene("pegarNome");

//oque o bot vai fazer ao entrar na cena
pegarNome.enter(async (ctx) => {
  try {
    //pegar chat id do cliente
    const chatIdCliente = ctx.chat.id;
    //checar se esse chatid existe no db
    const chatIdDb = await Usuario.findOne({
      where: { chatid_telegram: chatIdCliente },
    });
    if (chatIdDb) {
      //adicionar nome relaciona ao chat id a variavel de sessao para usar qunado necessario
      ctx.session.nome = chatIdDb.nome;
      //passar para a scene de apresentar servicos
      return ctx.scene.enter("apreServicos");
    } else {
      //caso seja o primeiro acesso do cliente / salva o chhat id no banco de dados
      await  Usuario.create({
        chatid_telegram: chatIdCliente
      });
      ctx.reply(
        "Olá Esse é o nosso sistema de Agendamento para uma melhor experiencia poderia nos dizer seu nome?"
      );
    }
  } catch (erros) {
    console.error("Erro ao processar chat id:", erros);
    ctx.reply("Desculpe, houve um erro. Tente novamente mais tarde.");
  }
});

pegarNome.on("text", async (ctx) => {
  try {
    //pega o nome adiciona a var de ambiente e const
    const nomeCliente = ctx.message.text;
    ctx.session.nome = ctx.message.text;

    //pegar caht id para associar ao nome
    const chatIdCliente = ctx.chat.id;

    //salvar nome no banco de dados
    await  Usuario.update(
      { nome: nomeCliente },
      { where: { chatid_telegram: chatIdCliente } }
    );
    //mensagem de confirmação para o cliente após salvar o nome
    ctx.reply(
      `Nome salvo com sucesso, ${nomeCliente}! Vamos prosseguir para os serviços.`
    );

    //mandar entao para apreServicos para presnetar os servicos
    return ctx.scene.enter("apreServicos");
  } catch (erros) {
    console.error("erro na parte de salvar nome pela primeira vez: " + erros);
    await ctx.reply(
      "Ocorreu um erro ao processar sua solicitação. Tente novamente."
    );
  }
});

export default pegarNome;

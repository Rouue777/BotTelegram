import express from "express";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import sequelize from "./config/dataBase.js";
import cors from "cors";
import Usuario from "./models/usuario.js";
import "./config/relation.js";
import pkg from 'telegraf';
const { Telegraf, session, Scenes } = pkg;
const { Stage } = Scenes; 
import https from "https";

//carregar variaveis .env
dotenv.config();

//intanciando express
const app = express();

//configurando midlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//importar scenes agendamentos
import pegarNome from './scenes/agendamento/pegarNome.js'
import apreServicos from "./scenes/agendamento/apreServicos.js";
import agendar from "./scenes/agendamento/agendar.js";

//importar scenes cancelar agendamentos
import agendamentoToCancel from "./scenes/cancelarAgendamento/agendamentoToCancel.js";

//importar scenes consultar agendamentos
import agendametoCheck from "./scenes/checarAgendamentos/agendamentosCheck.js";

//conectando e instanciando api do telegram
const bot = new Telegraf("7884544168:AAE99cV406qoYl9-CZ58cao2E1t0V65v_IY", {
  telegram: {
    timeout: 30000, // Timeout de 30 segundos
  },
});

// Instanciando o Stage e adicionando as cenas
const stage = new Stage([pegarNome,apreServicos,agendar,agendamentoToCancel,agendametoCheck]);

//configurando session do bot
bot.use(session());
bot.use(stage.middleware());

//fluxo do bot
bot.telegram
  .getMe()
  .then((infoBot) => {
    console.log(infoBot);
  })
  .catch((err) => {
    console.log(err);
  });

//iniciar bot
bot.command("start", (ctx) => {
    return ctx.scene.enter('pegarNome');
});

//rotas
//app.use(bot.webhookCallback('/webhook'))

// Inicia o polling do bot
bot
  .launch()
  .then(() => {
    console.log("Bot está funcionando!");
  })
  .catch((err) => {
    console.error("Erro ao iniciar o bot:", err);
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Servidor rodando na porta " + port + " http://localhost:3330 ");
});

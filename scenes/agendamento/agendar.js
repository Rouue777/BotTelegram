//imports
import sequelize from "../../config/dataBase.js";
import Usuario from "../../models/usuario.js";
import Agendamento from "../../models/agendamento.js";
import { Scenes } from "telegraf";

//instanciar scene
const agendar = new Scenes.BaseScene('agendar');

agendar.enter(async (ctx) => {
    // Exibir mensagem organizada com emojis
    await ctx.reply(
        '✨ Ótimo! Vamos agendar o seu compromisso. 🗓️\n\n' +
        'Para facilitar, por favor, me informe a **data e a hora** do seu agendamento. ⏰\n\n' +
        'Use o formato: `AAAA-MM-DD HH:mm`, por exemplo:\n' +
        '📅 2024-11-25 15:30\n\n' +
        'Fique à vontade para enviar a data e hora do seu compromisso! 😊'
    );
});


//exportar scene
export default agendar;
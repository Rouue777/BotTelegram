import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

//variaveis de ambiente
dotenv.config();

//instanciando classe sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
    host : process.env.DB_HOST,
    dialect : 'mysql',
    port : process.env.DB_PORT,
    dialectOptions: {
        connectTimeout: 60000
    }
})



//autenticando conexão
sequelize.authenticate().then(() => {
    console.log("Database conectado com sucesso")
}).catch((err) =>{
    console.log("Erro ao conectar á Database " + err)
})


export default sequelize
import * as mysql from 'mysql';
import * as Discord from 'discord.js';
import { Sequelize } from 'sequelize';

import * as dotenv from 'dotenv';
dotenv.config();

const classified = {
  getToken(): string {
    return `${process.env.DISCORD_TOKEN}`;
  },
  getCon(): mysql.Connection {
    const con = mysql.createConnection({
      host: `${process.env.CONNECTION_HOST}`,
      user: `${process.env.CONNECTION_USER}`,
      password: `${process.env.CONNECTION_PASSWORD}`,
      database: `${process.env.CONNECTION_DATABASE}`,
    });

    return con;
  },
  getSeq(): Sequelize {
    const sequelize = new Sequelize(
      `${process.env.CONNECTION_DATABASE}`,
      `${process.env.CONNECTION_USER}`,
      `${process.env.CONNECTION_PASSWORD}`,
      {
        host: `${process.env.CONNECTION_HOST}`,
        dialect: `mysql`,
        logging: false,
      }
    );

    return sequelize;
  },
};

const bot: Discord.Client = new Discord.Client();
bot.login(classified.getToken());

export default { classified, bot };

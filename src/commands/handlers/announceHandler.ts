import * as Discord from 'discord.js';
import background from '../../background';
import database from '../../database';
import Classified from '../../classified';

const bot = Classified.bot;

const announceHandler = {
  async announce(msg: Discord.Message, args: string[]): Promise<void> {
    if (msg.member!.id == '355043764861140993') {
      let reason = '';
      for (let i = 1; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      const serversRow = await database.Announcement();
      const servers = serversRow.split(':');
      servers.forEach(element => {
        const args = element.split(',');
        const serverID = args[0];
        const channelID = args[1];
        const server = bot.guilds.cache.get(serverID);
        if (server) {
          const channel = server.channels.cache.get(
            channelID
          ) as Discord.TextChannel;
          if (channel) {
            channel.send(
              `**@here Wiadomość od autora: **${background.formatMessage(
                reason
              )}`
            );
          }
        }
      });
    }
  },
};
export default announceHandler;
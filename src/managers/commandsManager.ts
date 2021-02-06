import * as Discord from 'discord.js';
import background from '../background';
import classified from '../classified';
import EndingMessage from '../commands/endMessages';
import * as Handlers from '../commands/export';
import database from '../database';

const bot = classified.bot;

const commandsManager = {
  async msgProcessor(msg: Discord.Message): Promise<void> {
    const command = msg.content.substring(1);
    const args = command.split(' ');
    try {
      if (msg.channel.type == 'dm') {
        throw 'Nie przyjmuję zleceń w wiadomościach prywatnych 👿';
      }
      if (!msg.guild!.me!.hasPermission('ADMINISTRATOR')) {
        throw 'Potrzebuję uprawnień administratora do poprawnego działania.';
      }
      const channelID = await database.getLogChannel(msg.guild!.id);
      const channel = bot.channels.cache.get(channelID);
      if (args[0] == 'publicznelogi') {
        Handlers.publiclogsHandler.setChannel(msg);
      } else if (args[0] == 'pomoc' || args[0] == 'help') {
        throw EndingMessage.DocsMessage;
      }
      if (channel == undefined) {
        throw EndingMessage.NoAccessToLogChannel;
      }
      const publicLogChannel = channel as Discord.TextChannel;
      switch (args[0]) {
        case 'kick':
          Handlers.kickHandler.kick(msg, args, publicLogChannel);
          break;
        case 'ban':
          Handlers.banHandler.ban(msg, args, publicLogChannel);
          break;
        case 'mute':
          Handlers.muteHandler.mute(msg, args, publicLogChannel);
          break;
        case 'unmute':
          Handlers.unmuteHandler.unmute(msg, publicLogChannel);
          break;
        case 'tempban':
          Handlers.tempbanHandler.tempban(msg, args, publicLogChannel);
          break;
        case 'warn':
          Handlers.warnHandler.warn(msg, args, publicLogChannel);
          break;
        case 'mutetime':
          Handlers.mutetimeHandler.mutetime(msg, args);
          break;
        case 'prywatnelogi':
          Handlers.privatelogsHandler.setPrivateLogs(msg);
          break;
        case 'statystyki':
          Handlers.statsHandler.setStatChannel(msg, args);
          break;
        case 'blacklist':
          Handlers.blacklistHandler.blacklist(msg, args);
          break;
        case 'mention':
          Handlers.mentionHandler.mention(msg, args);
          break;
        case 'ogłoś':
          Handlers.announceHandler.announce(msg, args);
          break;
      }
    } catch (err) {
      if (msg.channel.type != 'dm') {
        const reason = '$ ' + err + ' //';
        background.drd(msg, reason);
      } else {
        msg.reply(err);
      }
    }
  },
};
export default commandsManager;

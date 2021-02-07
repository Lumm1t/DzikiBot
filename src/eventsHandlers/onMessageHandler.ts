import * as Discord from 'discord.js';
import background from '../background';
import classified from '../classified';
import EndingMessage from '../commands/endMessages';
import * as Handlers from '../commands/export';
import * as database from '../database/export';

const bot = classified.bot;

async function messageHandler(msg: Discord.Message): Promise<void> {
  const command = msg.content.substring(1);
  const args = command.split(' ');
  try {
    if (msg.channel.type == 'dm') {
      throw 'Nie przyjmuję zleceń w wiadomościach prywatnych 👿';
    }
    if (!msg.guild!.me!.hasPermission('ADMINISTRATOR')) {
      throw 'Potrzebuję uprawnień administratora do poprawnego działania.';
    }
    const channelID = await database.getPublicLogChannel(msg.guild!.id);
    const channel = bot.channels.cache.get(channelID);
    if (args[0] == 'publicznelogi') {
      Handlers.publiclogsHandler(msg);
    } else if (args[0] == 'pomoc' || args[0] == 'help') {
      throw EndingMessage.DocsMessage;
    }
    if (channel == undefined) {
      throw EndingMessage.NoAccessToLogChannel;
    }
    const publicLogChannel = channel as Discord.TextChannel;
    switch (args[0]) {
      case 'kick':
        Handlers.kickHandler(msg, args, publicLogChannel);
        break;
      case 'ban':
        Handlers.banHandler(msg, args, publicLogChannel);
        break;
      case 'mute':
        Handlers.muteHandler(msg, args, publicLogChannel);
        break;
      case 'unmute':
        Handlers.unmuteHandler(msg, publicLogChannel);
        break;
      case 'tempban':
        Handlers.tempbanHandler(msg, args, publicLogChannel);
        break;
      case 'warn':
        Handlers.warnHandler(msg, args, publicLogChannel);
        break;
      case 'mutetime':
        Handlers.mutetimeHandler(msg, args);
        break;
      case 'prywatnelogi':
        Handlers.privatelogsHandler(msg);
        break;
      case 'statystyki':
        Handlers.statsHandler(msg, args);
        break;
      case 'blacklist':
        Handlers.blacklistHandler(msg, args);
        break;
      case 'mention':
        Handlers.mentionHandler(msg, args);
        break;
      case 'ogłoś':
        Handlers.announceHandler(msg, args);
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
}
export default messageHandler;

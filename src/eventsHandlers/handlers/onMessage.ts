import {
  Discord,
  database,
  classified,
  EndingMessage,
  commands,
  background,
} from '../import';

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
      commands.publiclogsHandler(msg);
    } else if (args[0] == 'pomoc' || args[0] == 'help') {
      throw EndingMessage.DocsMessage;
    }
    if (channel == undefined) {
      throw EndingMessage.NoAccessToLogChannel;
    }
    const publicLogChannel = channel as Discord.TextChannel;
    switch (args[0]) {
      case 'kick':
        await commands.kickHandler(msg, args, publicLogChannel);
        break;
      case 'ban':
        await commands.banHandler(msg, args, publicLogChannel);
        break;
      case 'mute':
        await commands.muteHandler(msg, args, publicLogChannel);
        break;
      case 'unmute':
        await commands.unmuteHandler(msg, publicLogChannel);
        break;
      case 'tempban':
        await commands.tempbanHandler(msg, args, publicLogChannel);
        break;
      case 'warn':
        await commands.warnHandler(msg, args, publicLogChannel);
        break;
      case 'mutetime':
        await commands.mutetimeHandler(msg, args);
        break;
      case 'prywatnelogi':
        await commands.privatelogsHandler(msg);
        break;
      case 'statystyki':
        await commands.statsHandler(msg, args);
        break;
      case 'blacklist':
        await commands.blacklistHandler(msg, args);
        break;
      case 'mention':
        await commands.mentionHandler(msg, args);
        break;
      case 'ogłoś':
        await commands.announceHandler(msg, args);
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

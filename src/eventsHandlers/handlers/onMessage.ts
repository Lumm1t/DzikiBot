import * as Imports from '../import';

const bot = Imports.classified.bot;

async function messageHandler(msg: Imports.Discord.Message): Promise<void> {
  const command = msg.content.substring(1);
  const args = command.split(' ');
  try {
    if (msg.channel.type == 'dm') {
      throw 'Nie przyjmuję zleceń w wiadomościach prywatnych 👿';
    }
    if (!msg.guild!.me!.hasPermission('ADMINISTRATOR')) {
      throw 'Potrzebuję uprawnień administratora do poprawnego działania.';
    }
    const channelID = await Imports.database.getPublicLogChannel(msg.guild!.id);
    const channel = bot.channels.cache.get(channelID);
    if (args[0] == 'publicznelogi') {
      Imports.commands.publiclogsHandler(msg);
    } else if (args[0] == 'pomoc' || args[0] == 'help') {
      throw Imports.EndingMessage.DocsMessage;
    }
    if (channel == undefined) {
      throw Imports.EndingMessage.NoAccessToLogChannel;
    }
    const publicLogChannel = channel as Imports.Discord.TextChannel;
    switch (args[0]) {
      case 'kick':
        Imports.commands.kickHandler(msg, args, publicLogChannel);
        break;
      case 'ban':
        Imports.commands.banHandler(msg, args, publicLogChannel);
        break;
      case 'mute':
        Imports.commands.muteHandler(msg, args, publicLogChannel);
        break;
      case 'unmute':
        Imports.commands.unmuteHandler(msg, publicLogChannel);
        break;
      case 'tempban':
        Imports.commands.tempbanHandler(msg, args, publicLogChannel);
        break;
      case 'warn':
        Imports.commands.warnHandler(msg, args, publicLogChannel);
        break;
      case 'mutetime':
        Imports.commands.mutetimeHandler(msg, args);
        break;
      case 'prywatnelogi':
        Imports.commands.privatelogsHandler(msg);
        break;
      case 'statystyki':
        Imports.commands.statsHandler(msg, args);
        break;
      case 'blacklist':
        Imports.commands.blacklistHandler(msg, args);
        break;
      case 'mention':
        Imports.commands.mentionHandler(msg, args);
        break;
      case 'ogłoś':
        Imports.commands.announceHandler(msg, args);
        break;
    }
  } catch (err) {
    if (msg.channel.type != 'dm') {
      const reason = '$ ' + err + ' //';
      Imports.background.drd(msg, reason);
    } else {
      msg.reply(err);
    }
  }
}
export default messageHandler;

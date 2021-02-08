import { bot, classified } from './classified';
import * as Discord from 'discord.js';
import * as eventsHandlers from './eventsHandlers/export';
import * as modules from './functions/export';

bot.on('ready', () => {
  modules.updateStats();
  modules.removeLimitations();
  modules.setStatusBar();
  classified.getSeq();
});

bot.on('message', msg => {
  if (msg.content.startsWith('$') && !msg.member!.user.bot) {
    eventsHandlers.messageHandler(msg);
  }
});

bot.on('messageUpdate', async (oldMessage, newMessage) => {
  eventsHandlers.messageUpdateHandler(
    oldMessage as Discord.Message,
    newMessage as Discord.Message
  );
});

bot.on('messageDelete', async deletedMessage => {
  eventsHandlers.messageDeleteHandler(deletedMessage as Discord.Message);
});

bot.on('guildMemberAdd', newMember => {
  eventsHandlers.guildMemberAddHandler(newMember);
});

bot.on('guildMemberRemove', oldMember => {
  eventsHandlers.guildMemberRemoveHandler(oldMember as Discord.GuildMember);
});

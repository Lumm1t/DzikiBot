import Classified from './classified';
import * as Discord from 'discord.js';
import * as eventsHandlers from './eventsHandlers/export';

const bot = Classified.bot;

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

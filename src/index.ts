import Classified from './classified';
import messageHandler from './eventsHandlers/onMessageHandler';

const bot = Classified.bot;

bot.on('message', msg => {
  if (msg.content.startsWith('$') && !msg.member!.user.bot) {
    messageHandler(msg);
  }
});

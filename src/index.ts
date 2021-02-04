import Classified from './classified';
import commandsManager from './commandsManager';

const bot = Classified.bot;

bot.on('message', msg => {
  if (msg.content.startsWith('$') && !msg.member!.user.bot) {
    commandsManager.msgProcessor(msg);
  }
});

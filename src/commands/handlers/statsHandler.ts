import * as Discord from 'discord.js';
import background from '../../background';
import database from '../../database';

const Handler = {
  async setStatChannel(msg: Discord.Message, args: string[]): Promise<void> {
    const msgAuthor = msg.member!;
    if (msgAuthor.hasPermission('ADMINISTRATOR')) {
      const channelID = args[2];
      const channel = msg.guild?.channels.cache.get(channelID);
      if (channel) {
        if (channel.type == 'voice') {
          await database.setStatistic(msg, args[1], channel);
          background.drd(
            msg,
            'Udane ustawienie statystyki na: ' + channel.name
          );
        } else {
          background.drd(msg, 'Podany kanał musi być kanałem głosowym');
        }
      } else {
        background.drd(msg, 'Błędne ID kanału');
      }
    } else {
      background.drd(msg, 'Nie posiadasz uprawnień');
    }
  },
};
export default Handler;

import { Discord, database, functions } from '../import';

async function setStatChannel(
  msg: Discord.Message,
  args: string[]
): Promise<void> {
  const msgAuthor = msg.member!;
  if (msgAuthor.hasPermission('ADMINISTRATOR')) {
    const channelID = args[2];
    const channel = msg.guild?.channels.cache.get(channelID);
    if (channel) {
      if (channel.type == 'voice') {
        await database.setStatistic(msg, args[1], channel);
        functions.reply(msg, 'Udane ustawienie statystyki na: ' + channel.name);
      } else {
        functions.reply(msg, 'Podany kanał musi być kanałem głosowym');
      }
    } else {
      functions.reply(msg, 'Błędne ID kanału');
    }
  } else {
    functions.reply(msg, 'Nie posiadasz uprawnień');
  }
}
export default setStatChannel;

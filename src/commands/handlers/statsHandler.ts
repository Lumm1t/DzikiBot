import * as Imports from '../import';

async function setStatChannel(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<void> {
  const msgAuthor = msg.member!;
  if (msgAuthor.hasPermission('ADMINISTRATOR')) {
    const channelID = args[2];
    const channel = msg.guild?.channels.cache.get(channelID);
    if (channel) {
      if (channel.type == 'voice') {
        await Imports.database.setStatistic(msg, args[1], channel);
        Imports.background.drd(
          msg,
          'Udane ustawienie statystyki na: ' + channel.name
        );
      } else {
        Imports.background.drd(msg, 'Podany kanał musi być kanałem głosowym');
      }
    } else {
      Imports.background.drd(msg, 'Błędne ID kanału');
    }
  } else {
    Imports.background.drd(msg, 'Nie posiadasz uprawnień');
  }
}
export default setStatChannel;

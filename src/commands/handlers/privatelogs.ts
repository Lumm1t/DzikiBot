import { Discord, database, background } from '../import';

async function setPrivateLogs(msg: Discord.Message): Promise<void> {
  const msgAuthor = msg.member!;
  if (msgAuthor.hasPermission('ADMINISTRATOR')) {
    const channel = msg.mentions.channels.first();
    if (channel) {
      if (channel.type == 'text') {
        database.setPrivateLogChannel(msg, channel);
        background.drd(
          msg,
          'Udane ustawienie prywatnych logów na kanał: ' + channel.name
        );
      }
    } else {
      background.drd(
        msg,
        'Musisz oznaczyć kanał tekstowy. $prywatnelogi #kanał'
      );
    }
  }
}
export default setPrivateLogs;

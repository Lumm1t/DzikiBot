import { Discord, database, functions } from '../import';

async function setPrivateLogs(msg: Discord.Message): Promise<void> {
  const msgAuthor = msg.member!;
  if (msgAuthor.hasPermission('ADMINISTRATOR')) {
    const channel = msg.mentions.channels.first();
    if (channel) {
      if (channel.type == 'text') {
        database.setPrivateLogChannel(msg, channel);
        functions.reply(
          msg,
          'Udane ustawienie prywatnych logów na kanał: ' + channel.name
        );
      }
    } else {
      functions.reply(
        msg,
        'Musisz oznaczyć kanał tekstowy. $prywatnelogi #kanał'
      );
    }
  }
}
export default setPrivateLogs;

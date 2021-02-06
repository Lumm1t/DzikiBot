import * as Imports from '../import';

async function setPrivateLogs(msg: Imports.Discord.Message): Promise<void> {
  const msgAuthor = msg.member!;
  if (msgAuthor.hasPermission('ADMINISTRATOR')) {
    const channel = msg.mentions.channels.first();
    if (channel) {
      if (channel.type == 'text') {
        Imports.database.setPrivateLogChannel(msg, channel);
        Imports.background.drd(
          msg,
          'Udane ustawienie prywatnych logów na kanał: ' + channel.name
        );
      }
    } else {
      Imports.background.drd(
        msg,
        'Musisz oznaczyć kanał tekstowy. $prywatnelogi #kanał'
      );
    }
  }
}
export default setPrivateLogs;

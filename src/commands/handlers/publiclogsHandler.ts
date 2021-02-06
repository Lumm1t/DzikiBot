import * as Imports from '../import';

async function setChannel(msg: Imports.Discord.Message): Promise<void> {
  if (!msg.member!.hasPermission('ADMINISTRATOR')) {
    throw Imports.EndingMessage.NoPermissions;
  }
  const channel = msg.mentions.channels.first();
  if (!channel || channel.type != 'text') {
    throw 'Musisz oznaczyć kanał tekstowy. $publicznelogi #kanał';
  }
  Imports.database.setPublicLogChannel(msg, channel);
  throw Imports.EndingMessage.SuccessfulSetPublicLogs + channel.name;
}
export default setChannel;

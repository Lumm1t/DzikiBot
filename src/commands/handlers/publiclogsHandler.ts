import { Discord, database, EndingMessage } from '../import';

async function setChannel(msg: Discord.Message): Promise<void> {
  if (!msg.member!.hasPermission('ADMINISTRATOR')) {
    throw EndingMessage.NoPermissions;
  }
  const channel = msg.mentions.channels.first();
  if (!channel || channel.type != 'text') {
    throw 'Musisz oznaczyć kanał tekstowy. $publicznelogi #kanał';
  }
  database.setPublicLogChannel(msg, channel);
  throw EndingMessage.SuccessfulSetPublicLogs + channel.name;
}
export default setChannel;

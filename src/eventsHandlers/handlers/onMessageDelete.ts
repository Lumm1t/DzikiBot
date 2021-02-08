import { Discord, database, messages } from '../import';

async function messageDeleteHandler(
  deletedMessage: Discord.Message
): Promise<void> {
  if (deletedMessage.channel.type != 'dm' && !deletedMessage.author.bot) {
    const channelsList = await database.getBlacklist(deletedMessage.guild!);
    if (channelsList) {
      const channels: string[] = channelsList.split(',');
      channels.pop(); // last index of table is always ','
      if (channels.indexOf(deletedMessage.channel.id) == -1) {
        const server = deletedMessage.guild;
        database.getPrivateLogChannel(server!.id).then(channelID => {
          const logchannel = server!.channels.cache.get(
            channelID
          ) as Discord.TextChannel;
          if (logchannel) {
            messages
              .deleteLogsMessage(deletedMessage as Discord.Message)
              .then(deleteMessage => {
                logchannel.send(deleteMessage);
              });
          }
        });
      }
    } else {
      const server = deletedMessage.guild;
      database.getPrivateLogChannel(server!.id).then(channelID => {
        const logchannel = server!.channels.cache.get(
          channelID
        ) as Discord.TextChannel;

        if (logchannel) {
          messages
            .deleteLogsMessage(deletedMessage as Discord.Message)
            .then(deleteMessage => {
              logchannel.send(deleteMessage);
            });
        }
      });
    }
  }
}
export default messageDeleteHandler;

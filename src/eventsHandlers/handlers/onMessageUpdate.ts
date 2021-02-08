import { Discord, database, messages } from '../import';

async function messageUpdateHandler(
  oldMessage: Discord.Message,
  newMessage: Discord.Message
): Promise<void> {
  if (oldMessage.channel.type != 'dm' && !oldMessage.author!.bot) {
    const channelsList = await database.getBlacklist(oldMessage.guild!);
    if (channelsList) {
      const channels: string[] = channelsList.split(',');
      channels.pop(); // last index of table is always ','
      if (channels.indexOf(oldMessage.channel.id) == -1) {
        const server = newMessage.guild;
        database.getPrivateLogChannel(server!.id).then(channelID => {
          const logChannel = server!.channels.cache.get(
            channelID
          ) as Discord.TextChannel;

          if (logChannel) {
            messages
              .editLogsMessage(
                oldMessage as Discord.Message,
                newMessage as Discord.Message
              )
              .then(editMessage => {
                logChannel.send(editMessage);
              });
          }
        });
      }
    } else {
      const server = newMessage.guild;
      database.getPrivateLogChannel(server!.id).then(channelID => {
        const logChannel = server!.channels.cache.get(
          channelID
        ) as Discord.TextChannel;

        if (logChannel) {
          messages
            .editLogsMessage(
              oldMessage as Discord.Message,
              newMessage as Discord.Message
            )
            .then(editMessage => {
              logChannel.send(editMessage);
            });
        }
      });
    }
  }
}
export default messageUpdateHandler;

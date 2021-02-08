import { Discord, database, messages } from '../import';

async function guildMemberRemoveHandler(
  oldMember: Discord.GuildMember
): Promise<void> {
  const server = oldMember.guild;
  database.getPrivateLogChannel(server.id).then(channelID => {
    const logChannel = server.channels.cache.get(
      channelID
    ) as Discord.TextChannel;

    if (logChannel) {
      messages
        .leaveLogsMessage(oldMember as Discord.GuildMember)
        .then(leaveMessage => {
          logChannel.send(leaveMessage);
        });
    }
  });
}
export default guildMemberRemoveHandler;

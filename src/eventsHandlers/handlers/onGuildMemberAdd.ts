import { Discord, database, messages } from '../import';

async function guildMemberAddHandler(
  newMember: Discord.GuildMember
): Promise<void> {
  const server = newMember.guild;
  database
    .getMuteInfo(newMember)
    .then(() => {
      const role = server.roles.cache.find(r => r.name === 'Muted');
      if (role) {
        newMember.roles.add(role);
      }
    })
    .catch();

  database.getPrivateLogChannel(server.id).then(channelID => {
    const logChannel = server.channels.cache.get(
      channelID
    ) as Discord.TextChannel;
    if (logChannel) {
      messages.joinLogsMessage(newMember).then(joinMessage => {
        logChannel.send(joinMessage);
      });
    }
  });
}
export default guildMemberAddHandler;

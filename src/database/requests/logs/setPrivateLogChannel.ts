import { Discord, models } from '../../import';
async function setPrivateLogChannel(
  msg: Discord.Message,
  channel: Discord.GuildChannel
): Promise<void> {
  const guild = await models.servers.findOne({
    where: {
      serwer: msg.guild!.id,
    },
  });
  if (guild) {
    guild.set('logi2', channel.id);
    guild.save();
  }
}
export default setPrivateLogChannel;

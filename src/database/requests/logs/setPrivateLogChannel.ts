import * as Imports from '../../import';

async function setPrivateLogChannel(
  msg: Imports.Discord.Message,
  channel: Imports.Discord.GuildChannel
): Promise<void> {
  const guild = await Imports.models.servers.findOne({
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

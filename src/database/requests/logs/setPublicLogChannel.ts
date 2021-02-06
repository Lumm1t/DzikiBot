import * as Imports from '../import';

async function setPublicLogChannel(
  msg: Imports.Discord.Message,
  channel: Imports.Discord.GuildChannel
): Promise<void> {
  const [guild] = await Imports.models.servers.findOrCreate({
    where: {
      serwer: msg.guild!.id,
    },
    defaults: {
      serwer: msg.guild!.id,
      prefix: 0,
      logi: channel.id,
      warn: '12h',
    },
  });
  if (guild) {
    guild.set('logi', channel.id);
    guild.save();
  }
}
export default setPublicLogChannel;

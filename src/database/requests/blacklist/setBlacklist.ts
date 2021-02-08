import { Discord, models } from '../../import';

async function setBlacklist(
  server: Discord.Guild,
  channels: string
): Promise<void> {
  const guild = await models.servers.findOne({
    where: {
      serwer: server.id,
    },
  });
  if (guild) {
    guild.set('blacklist', channels);
    guild.save();
  }
}
export default setBlacklist;

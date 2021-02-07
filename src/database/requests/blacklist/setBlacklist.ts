import * as Imports from '../../import';

async function setBlacklist(
  server: Imports.Discord.Guild,
  channels: string
): Promise<void> {
  const guild = await Imports.models.servers.findOne({
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

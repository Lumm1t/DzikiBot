import * as Imports from '../import';

async function getBlacklist(server: Imports.Discord.Guild): Promise<string> {
  const guild = await Imports.models.servers.findOne({
    where: {
      serwer: server.id,
    },
  });
  return new Promise<string>(resolve => {
    if (guild) {
      const channels = guild.get('blacklist') as string;
      resolve(channels);
    }
  });
}
export default getBlacklist;

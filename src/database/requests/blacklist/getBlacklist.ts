import { Discord, models } from '../../import';

async function getBlacklist(server: Discord.Guild): Promise<string> {
  const guild = await models.servers.findOne({
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

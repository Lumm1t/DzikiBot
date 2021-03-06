import { models } from '../../import';

async function getLogChannel(serverID: string): Promise<string> {
  const guild = await models.servers.findOne({
    where: {
      serwer: serverID,
    },
  });

  return new Promise<string>(resolve => {
    if (guild) {
      const channelID = guild.get('logi') as string;
      resolve(channelID);
    } else {
      resolve('');
    }
  });
}
export default getLogChannel;

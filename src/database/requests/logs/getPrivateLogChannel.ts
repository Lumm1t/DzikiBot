import { models } from '../../import';

async function getPrivateLogChannel(serverID: string): Promise<string> {
  const guild = await models.servers.findOne({
    where: {
      serwer: serverID,
    },
  });

  return new Promise<string>(resolve => {
    if (guild) {
      const channelID = guild.get('logi2') as string;
      resolve(channelID);
    } else {
      resolve('');
    }
  });
}
export default getPrivateLogChannel;

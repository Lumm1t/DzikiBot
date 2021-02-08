import { Discord, models } from '../../import';

async function getWarnTime(msg: Discord.Message): Promise<string> {
  const guild = await models.servers.findOne({
    where: {
      serwer: msg.guild!.id,
    },
  });
  return new Promise<string>(resolve => {
    if (guild) {
      const time = guild.get('warn') as string;
      resolve(time);
    }
  });
}
export default getWarnTime;

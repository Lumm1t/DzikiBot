import * as Imports from '../../import';

async function getWarnTime(msg: Imports.Discord.Message): Promise<string> {
  const guild = await Imports.models.servers.findOne({
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

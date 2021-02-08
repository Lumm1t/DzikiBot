import { Discord, models } from '../../import';

async function setAutoMuteTime(
  msg: Discord.Message,
  args: string[]
): Promise<string> {
  const guild = await models.servers.findOne({
    where: {
      serwer: msg.guild!.id,
    },
  });
  return new Promise<string>(resolve => {
    if (guild) {
      guild.set('warn', args[1]);
      guild.save();
      resolve('');
    }
  });
}
export default setAutoMuteTime;

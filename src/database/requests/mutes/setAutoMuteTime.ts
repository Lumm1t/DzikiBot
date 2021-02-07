import * as Imports from '../../import';

async function setAutoMuteTime(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<string> {
  const guild = await Imports.models.servers.findOne({
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

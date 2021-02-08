import { Discord, models } from '../../import';

async function getMuteInfo(newMember: Discord.GuildMember): Promise<string> {
  const user = await models.users.findOne({
    where: {
      serwer: newMember.guild.id,
      uzytkownik: newMember.id,
    },
  });
  return new Promise<string>((resolve, reject) => {
    if (user) {
      const date = user.get('data_zakonczenia_muta') as string;
      if (!(date == '0' || date == null)) resolve('');
      else reject();
    }
  });
}
export default getMuteInfo;

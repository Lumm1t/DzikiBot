import { Discord, models } from '../../import';

async function setUnmute(subject: Discord.GuildMember): Promise<void> {
  const user = await models.users.findOne({
    where: {
      serwer: subject.guild.id,
      uzytkownik: subject.id,
    },
  });
  if (user) {
    user.set('data_zakonczenia_muta', 0);
    user.save();
  }
}
export default setUnmute;

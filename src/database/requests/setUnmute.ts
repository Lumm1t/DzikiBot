import * as Imports from '../import';

async function setUnmute(subject: Imports.Discord.GuildMember): Promise<void> {
  const user = await Imports.models.users.findOne({
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

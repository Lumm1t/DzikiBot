import * as Imports from '../import';

async function setAndGetWarn(
  subject: Imports.Discord.GuildMember,
  ending: string
): Promise<number> {
  const [user] = await Imports.models.users.findOrCreate({
    where: {
      serwer: subject.guild.id,
      uzytkownik: subject.id,
    },
    defaults: {
      serwer: subject.guild.id,
      uzytkownik: subject.id,
      ilosc_warnow: '0',
      data_zakonczenia: ending,
    },
  });
  return new Promise<number>(resolve => {
    if (user) {
      let warnCount = user.get('ilosc_warnow') as number;
      warnCount++;
      if (warnCount == 4) warnCount--;
      user.set('ilosc_warnow', warnCount);
      user.set('data_zakonczenia', ending);
      user.save();
      resolve(warnCount);
    }
  });
}
export default setAndGetWarn;

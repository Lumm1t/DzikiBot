import * as Imports from '../../import';

async function setWarn(
  serverID: string,
  subjectID: string,
  ending: string,
  warnCount: number
): Promise<void> {
  const user = await Imports.models.users.findOne({
    where: {
      serwer: serverID,
      uzytkownik: subjectID,
    },
  });
  return new Promise(() => {
    if (user) {
      if (warnCount == 0) {
        user.set('data_zakonczenia', 0);
        user.set('ilosc_warnow', 0);
      } else {
        user.set('data_zakonczenia', ending);
        user.set('ilosc_warnow', warnCount);
      }
      user.save();
    }
  });
}
export default setWarn;

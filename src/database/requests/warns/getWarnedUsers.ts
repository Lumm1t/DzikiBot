import * as Imports from '../../import';

async function getWarnedUsers(): Promise<[string[], string[], number[]]> {
  const time = await Imports.modules.setEndingDate('0m', 'db', true);
  const serversID: string[] = [];
  const usersID: string[] = [];
  const warnsCount: number[] = [];
  const users = await Imports.models.users.findAll({
    where: {
      data_zakonczenia: {
        [Imports.Seq.Op.and]: [
          { [Imports.Seq.Op.ne]: 0 },
          { [Imports.Seq.Op.lte]: time },
        ],
      },
    },
  });
  let i = 0;
  users.forEach(element => {
    serversID[i] = element.get('serwer') as string;
    usersID[i] = element.get('uzytkownik') as string;
    warnsCount[i] = element.get('ilosc_warnow') as number;
    ++i;
  });
  return new Promise<[string[], string[], number[]]>(resolve => {
    resolve([serversID, usersID, warnsCount]);
  });
}
export default getWarnedUsers;

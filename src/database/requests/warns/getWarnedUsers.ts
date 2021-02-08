import { models, modules, Seq } from '../../import';

async function getWarnedUsers(): Promise<[string[], string[], number[]]> {
  const time = await modules.setEndingDate('0m', 'db', true);
  const serversID: string[] = [];
  const usersID: string[] = [];
  const warnsCount: number[] = [];
  const users = await models.users.findAll({
    where: {
      data_zakonczenia: {
        [Seq.Op.and]: [{ [Seq.Op.ne]: 0 }, { [Seq.Op.lte]: time }],
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

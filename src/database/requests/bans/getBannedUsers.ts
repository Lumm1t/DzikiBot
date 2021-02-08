import { modules, models, Seq } from '../../import';

async function getBannedUsers(): Promise<[string[], string[]]> {
  const time = await modules.setEndingDate('0m', 'db', true);
  const serversID: string[] = [];
  const usersID: string[] = [];
  const users = await models.users.findAll({
    where: {
      data_zakonczenia_bana: {
        [Seq.Op.and]: [{ [Seq.Op.ne]: 0 }, { [Seq.Op.lte]: time }],
      },
    },
  });
  let i = 0;
  users.forEach(element => {
    serversID[i] = element.get('serwer') as string;
    usersID[i] = element.get('uzytkownik') as string;
    ++i;
  });
  return new Promise<[string[], string[]]>(resolve => {
    resolve([serversID, usersID]);
  });
}
export default getBannedUsers;

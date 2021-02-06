import * as Imports from '../import';

async function setUnban(serverID: string, userID: string): Promise<void> {
  const user = await Imports.models.users.findOne({
    where: {
      serwer: serverID,
      uzytkownik: userID,
    },
  });
  if (user) {
    user.set('data_zakonczenia_bana', 0);
    user.save();
  }
}
export default setUnban;

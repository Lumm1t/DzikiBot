import * as Imports from '../../import';

async function setTempBan(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<string> {
  const ending = await Imports.modules.setEndingDate(args[2], 'db', false);
  const subject = msg.mentions.members!.first()!;
  const [user] = await Imports.models.users.findOrCreate({
    where: {
      serwer: msg.guild!.id,
      uzytkownik: subject.id,
    },
    defaults: {
      serwer: msg.guild!.id,
      uzytkownik: subject.id,
      data_zakonczenia_bana: ending,
    },
  });
  return new Promise<string>(resolve => {
    if (user) {
      user.set('data_zakonczenia_bana', ending);
      user.save();
      resolve('');
    }
  });
}
export default setTempBan;

import { Discord, models, modules } from '../../import';

async function setMute(msg: Discord.Message, arg: string): Promise<string> {
  const ending = await modules.setEndingDate(arg, 'db', false);
  const subject = msg.mentions.members!.first()!;
  const [user] = await models.users.findOrCreate({
    where: {
      serwer: msg.guild!.id,
      uzytkownik: subject.id,
    },
    defaults: {
      serwer: msg.guild!.id,
      uzytkownik: subject.id,
      data_zakonczenia_muta: ending,
    },
  });
  return new Promise<string>(resolve => {
    user.set('data_zakonczenia_muta', ending);
    user.save();
    resolve('');
  });
}
export default setMute;

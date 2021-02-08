import {
  Discord,
  modules,
  database,
  EndingMessage,
  functions,
} from '../import';

async function mutetime(msg: Discord.Message, args: string[]): Promise<void> {
  const msgAuthor = msg.member!;
  if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
    EndingMessage.NoPermissions;
  }
  await modules.setEndingDate(args[1], 'text', true);
  await database.setAutoMuteTime(msg, args);
  functions.reply(
    msg,
    'Czas muta po 3 warnach został pomyślnie ustawiony na: ' + args[1]
  );
}
export default mutetime;

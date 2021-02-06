import * as Imports from '../import';

async function mutetime(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<void> {
  const msgAuthor = msg.member!;
  if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
    Imports.EndingMessage.NoPermissions;
  }
  await Imports.modules.setEndingDate(args[1], 'text', true);
  await Imports.database.setAutoMuteTime(msg, args);
  Imports.background.drd(
    msg,
    'Czas muta po 3 warnach został pomyślnie ustawiony na: ' + args[1]
  );
}
export default mutetime;

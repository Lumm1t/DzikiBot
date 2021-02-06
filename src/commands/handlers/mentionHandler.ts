import * as Imports from '../import';

async function mention(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<void> {
  const msgAuthor = msg.member!;
  const member = msg.mentions.members?.first();
  if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
    throw Imports.EndingMessage.NoPermissions;
  }
  if (!member) {
    throw Imports.EndingMessage.IncorrectUserData;
  }
  if (!args[2]) {
    throw Imports.EndingMessage.MentionArgException;
  }
  if (!/^[1-9][0-9]?$/i.test(args[2])) {
    throw Imports.EndingMessage.MentionNumberException;
  }
  let reason = '';
  for (let i = 3; i < args.length; i++) {
    reason += args[i] + ' ';
  }
  for (let i = 0; i < Number(args[2]); i++) {
    msg.channel.send(`${member} ${reason}`);
    await Imports.modules.delay(2000);
  }
}
export default mention;

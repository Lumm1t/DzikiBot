import * as Imports from '../import';

async function kick(
  msg: Imports.Discord.Message,
  args: string[],
  logChannel: Imports.Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;

  if (
    msgAuthor.hasPermission('KICK_MEMBERS') ||
    subject?.hasPermission('ADMINISTRATOR')
  ) {
    throw Imports.EndingMessage.NoPermissionOrUserIsAdmin;
  }
  if (!subject) {
    throw Imports.EndingMessage.IncorrectUserData;
  }

  const delivered = await Imports.background.sendDMmessage(
    msg,
    args,
    subject,
    1
  );
  const kickMessage = await Imports.messages.kickServerMessage(
    msg,
    args,
    subject,
    delivered
  );
  logChannel.send(kickMessage);
  subject.kick();
  Imports.background.waitAndDelete(msg, 10000);
}
export default kick;

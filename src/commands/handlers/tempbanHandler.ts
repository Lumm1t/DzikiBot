import * as Imports from '../import';

async function tempban(
  msg: Imports.Discord.Message,
  args: string[],
  logChannel: Imports.Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;
  if (
    !msgAuthor.hasPermission('KICK_MEMBERS') ||
    subject?.hasPermission('ADMINISTRATOR')
  ) {
    throw Imports.EndingMessage.NoPermissionOrUserIsAdmin;
  }

  if (!subject) {
    throw Imports.EndingMessage.IncorrectUserData;
  }

  await Imports.database.setTempban(msg, args);
  const delivered = await Imports.background.sendDMmessage(
    msg,
    args,
    subject,
    3
  );
  const tempBanMessage = await Imports.messages.tempBanMessage(
    msg,
    args,
    subject,
    delivered
  );

  logChannel.send(tempBanMessage);
  subject.ban();
  Imports.background.waitAndDelete(msg, 10000);
}
export default tempban;

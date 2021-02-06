import * as Imports from '../import';

async function ban(
  msg: Imports.Discord.Message,
  args: string[],
  logChannel: Imports.Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;

  if (
    !msgAuthor.hasPermission('BAN_MEMBERS') ||
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
    2
  );
  const banMessage = await Imports.messages.banServerMessage(
    msg,
    args,
    subject,
    delivered
  );
  logChannel.send(banMessage);
  subject.ban();
  Imports.background.waitAndDelete(msg, 10000);
}
export default ban;

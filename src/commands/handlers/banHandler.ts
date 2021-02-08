import { Discord, background, EndingMessage, messages } from '../import';

async function ban(
  msg: Discord.Message,
  args: string[],
  logChannel: Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;

  if (
    !msgAuthor.hasPermission('BAN_MEMBERS') ||
    subject?.hasPermission('ADMINISTRATOR')
  ) {
    throw EndingMessage.NoPermissionOrUserIsAdmin;
  }
  if (!subject) {
    throw EndingMessage.IncorrectUserData;
  }

  const delivered = await background.sendDMmessage(msg, args, subject, 2);
  const banMessage = await messages.banServerMessage(
    msg,
    args,
    subject,
    delivered
  );
  logChannel.send(banMessage);
  subject.ban();
  background.waitAndDelete(msg, 10000);
}
export default ban;

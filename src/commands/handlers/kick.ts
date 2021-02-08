import { Discord, background, EndingMessage, messages } from '../import';

async function kick(
  msg: Discord.Message,
  args: string[],
  logChannel: Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;

  if (
    msgAuthor.hasPermission('KICK_MEMBERS') ||
    subject?.hasPermission('ADMINISTRATOR')
  ) {
    throw EndingMessage.NoPermissionOrUserIsAdmin;
  }
  if (!subject) {
    throw EndingMessage.IncorrectUserData;
  }

  const delivered = await background.sendDMmessage(msg, args, subject, 1);
  const kickMessage = await messages.kickServerMessage(
    msg,
    args,
    subject,
    delivered
  );
  logChannel.send(kickMessage);
  subject.kick();
  background.waitAndDelete(msg, 10000);
}
export default kick;

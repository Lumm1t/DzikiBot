import {
  Discord,
  database,
  EndingMessage,
  messages,
  functions,
} from '../import';

async function tempban(
  msg: Discord.Message,
  args: string[],
  logChannel: Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;
  if (
    !msgAuthor.hasPermission('KICK_MEMBERS') ||
    subject?.hasPermission('ADMINISTRATOR')
  ) {
    throw EndingMessage.NoPermissionOrUserIsAdmin;
  }

  if (!subject) {
    throw EndingMessage.IncorrectUserData;
  }

  await database.setTempban(msg, args);
  const delivered = await functions.sendDMMessage(msg, args, subject, 3);
  const tempBanMessage = await messages.tempBanMessage(
    msg,
    args,
    subject,
    delivered
  );

  logChannel.send(tempBanMessage);
  subject.ban();
  functions.waitAndDelete(msg, 10000);
}
export default tempban;

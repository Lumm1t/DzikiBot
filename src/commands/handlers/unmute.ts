import { Discord, database, EndingMessage, functions } from '../import';

async function unmute(
  msg: Discord.Message,
  logChannel: Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;
  const role = msg.guild!.roles.cache.find(r => r.name === 'Muted');

  if (!msgAuthor.hasPermission('MANAGE_MESSAGES')) {
    throw EndingMessage.NoPermissions;
  }
  if (!subject) {
    throw EndingMessage.IncorrectUserData;
  }
  if (role == undefined) {
    throw EndingMessage.MutedRoleNotFound;
  }

  subject.roles.remove(role);
  logChannel.send(
    `<@${subject!.id}> został odmutowany przez: <@${msg.member!.id}>!`
  );
  database.setUnmute(subject);
  functions.waitAndDelete(msg, 10000);
}
export default unmute;

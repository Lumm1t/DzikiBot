import * as Imports from '../import';

async function unmute(
  msg: Imports.Discord.Message,
  logChannel: Imports.Discord.TextChannel
): Promise<void> {
  const subject = msg.mentions.members?.first();
  const msgAuthor = msg.member!;
  const role = msg.guild!.roles.cache.find(r => r.name === 'Muted');

  if (!msgAuthor.hasPermission('MANAGE_MESSAGES')) {
    throw Imports.EndingMessage.NoPermissions;
  }
  if (!subject) {
    throw Imports.EndingMessage.IncorrectUserData;
  }
  if (role == undefined) {
    throw Imports.EndingMessage.MutedRoleNotFound;
  }

  subject.roles.remove(role);
  logChannel.send(
    `<@${subject!.id}> został odmutowany przez: <@${msg.member!.id}>!`
  );
  Imports.database.setUnmute(subject);
  Imports.background.waitAndDelete(msg, 10000);
}
export default unmute;

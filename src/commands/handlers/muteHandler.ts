import * as Imports from '../import';

async function mute(
  msg: Imports.Discord.Message,
  args: string[],
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

  if (args[2] == null) {
    const muteMessage = await Imports.messages.permMuteMessage(msg, subject);
    subject.roles.add(role);
    logChannel.send(muteMessage);
    Imports.background.waitAndDelete(msg, 10000);
  } else {
    await Imports.database.setMute(msg, args[2]);
    subject.roles.add(role);
    const muteMessage = await Imports.messages.muteMessage(msg, args, subject);
    logChannel.send(muteMessage);
    Imports.background.waitAndDelete(msg, 10000);
  }
}
export default mute;

import {
  Discord,
  database,
  background,
  EndingMessage,
  messages,
} from '../import';

async function mute(
  msg: Discord.Message,
  args: string[],
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

  if (args[2] == null) {
    const muteMessage = await messages.permMuteMessage(msg, subject);
    subject.roles.add(role);
    logChannel.send(muteMessage);
    background.waitAndDelete(msg, 10000);
  } else {
    await database.setMute(msg, args[2]);
    subject.roles.add(role);
    const muteMessage = await messages.muteMessage(msg, args, subject);
    logChannel.send(muteMessage);
    background.waitAndDelete(msg, 10000);
  }
}
export default mute;

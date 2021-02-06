import * as Imports from '../import';

async function warn(
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

  const time = await Imports.modules.setEndingDate('3d', 'db', false);
  const warnCount = await Imports.database.setAndGetWarn(subject, time);
  if (warnCount != 3) {
    const warnMessage = await Imports.messages.warnMessage(
      msg,
      args,
      subject,
      warnCount,
      '0'
    );
    logChannel.send(warnMessage);
    Imports.background.waitAndDelete(msg, 10000);
  } else {
    const muteTime = await Imports.database.getWarnTime(msg);
    let date = await Imports.modules.setEndingDate(muteTime, 'text', true);

    if (!['0m', '0h', '0d'].includes(muteTime)) {
      Imports.database.setMute(msg, muteTime);
      subject.roles.add(role);
    } else {
      date = '0';
    }

    const warnMessage = await Imports.messages.warnMessage(
      msg,
      args,
      subject,
      warnCount,
      date
    );
    logChannel.send(warnMessage);
  }
}
export default warn;

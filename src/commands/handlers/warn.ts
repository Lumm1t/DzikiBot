import {
  Discord,
  database,
  background,
  modules,
  EndingMessage,
  messages,
} from '../import';

async function warn(
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

  const time = await modules.setEndingDate('3d', 'db', false);
  const warnCount = await database.setAndGetWarn(subject, time);
  if (warnCount != 3) {
    const warnMessage = await messages.warnMessage(
      msg,
      args,
      subject,
      warnCount,
      '0'
    );
    logChannel.send(warnMessage);
    background.waitAndDelete(msg, 10000);
  } else {
    const muteTime = await database.getWarnTime(msg);
    let date = await modules.setEndingDate(muteTime, 'text', true);

    if (!['0m', '0h', '0d'].includes(muteTime)) {
      database.setMute(msg, muteTime);
      subject.roles.add(role);
    } else {
      date = '0';
    }

    const warnMessage = await messages.warnMessage(
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

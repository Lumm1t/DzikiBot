import * as Discord from 'discord.js';
import modules from '../../modules';
import EndingMessage from '../endMessages';

async function mention(msg: Discord.Message, args: string[]): Promise<void> {
  const msgAuthor = msg.member!;
  const member = msg.mentions.members?.first();
  if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
    throw EndingMessage.NoPermissions;
  }
  if (!member) {
    throw EndingMessage.IncorrectUserData;
  }
  if (!args[2]) {
    throw EndingMessage.MentionArgException;
  }
  if (!/^[1-9][0-9]?$/i.test(args[2])) {
    throw EndingMessage.MentionNumberException;
  }
  let reason = '';
  for (let i = 3; i < args.length; i++) {
    reason += args[i] + ' ';
  }
  for (let i = 0; i < Number(args[2]); i++) {
    msg.channel.send(`${member} ${reason}`);
    await modules.delay(2000);
  }
}
export default mention;

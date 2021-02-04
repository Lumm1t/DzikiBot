import * as Discord from 'discord.js';
import background from '../../background';
import database from '../../database';
import messages from '../../messages';
import EndingMessage from '../endMessages';

const tempbanHandler = {
  async tempban(
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

    await database.tempBan(msg, args);
    const delivered = await background.sendDMmessage(msg, args, subject, 3);
    const tempBanMessage = await messages.tempBanMessage(
      msg,
      args,
      subject,
      delivered
    );

    logChannel.send(tempBanMessage);
    subject.ban();
    background.waitAndDelete(msg, 10000);
  },
};
export default tempbanHandler;

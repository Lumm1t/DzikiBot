import * as Discord from 'discord.js';
import background from '../../background';
import database from '../../database';
import EndingMessage from '../endMessages';

const unmuteHandler = {
  async unmute(
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
    database.unmute(subject);
    background.waitAndDelete(msg, 10000);
  },
};
export default unmuteHandler;

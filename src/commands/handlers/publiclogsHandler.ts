import * as Discord from 'discord.js';
import database from '../../database';
import EndingMessage from '../endMessages';

const publiclogsHandler = {
  async setChannel(msg: Discord.Message): Promise<void> {
    if (!msg.member!.hasPermission('ADMINISTRATOR')) {
      throw EndingMessage.NoPermissions;
    }
    const channel = msg.mentions.channels.first();
    if (!channel || channel.type != 'text') {
      throw 'Musisz oznaczyć kanał tekstowy. $publicznelogi #kanał';
    }
    database.setPublicLogs(msg, channel);
    throw EndingMessage.SuccessfulSetPublicLogs + channel.name;
  },
};
export default publiclogsHandler;

import * as Imports from '../import';

async function ShowList(msg: Imports.Discord.Message, channelsList: string) {
  if (channelsList) {
    const channels: string[] = channelsList.split(',');
    channels.pop(); // last index of table is always ','
    let message = 'NUMER : ID : NAZWA\n';
    let i = 1;
    const MESSAGE_LENGTH_LIMIT = 25;
    channels.forEach(channelID => {
      const channel = msg.guild!.channels.cache.get(
        channelID
      ) as Imports.Discord.TextChannel;
      if (channel) {
        message += `${i}. : ${channel.id} : ${channel.name}\n`;
      } else {
        message += `${i}. : ${channelID} : Nie znaleziono kanału\n`;
      }
      if (i == MESSAGE_LENGTH_LIMIT) {
        msg.channel.send(Imports.background.formatMessage(message));
        message = '';
      }
      i++;
    });
    msg.channel.send(Imports.background.formatMessage(message));
  } else {
    throw Imports.EndingMessage.BlacklistNullException;
  }
}

async function addChannel(msg: Imports.Discord.Message, channelsList: string) {
  const channel = msg.mentions.channels.first();
  if (!channel || channel.type != 'text') {
    throw Imports.EndingMessage.BlacklistchannelException;
  }
  if (channelsList) {
    const channels: string[] = channelsList.split(',');
    if (channels.length > 49) {
      throw Imports.EndingMessage.BlacklistLengthException;
    }
    if (channels.indexOf(channel.id) != -1) {
      throw Imports.EndingMessage.BlacklistChannelInDB;
    }
    Imports.database.setBlacklist(msg.guild!, channelsList + channel.id + ',');
  } else {
    Imports.database.setBlacklist(msg.guild!, channel.id + ',');
  }
  throw Imports.EndingMessage.BlacklistChannelAdded;
}

async function deleteChannel(
  msg: Imports.Discord.Message,
  args: string[],
  channelsList: string
) {
  if (channelsList) {
    const channels: string[] = channelsList.split(',');
    const channel = args[2];
    if (channels.indexOf(channel) == -1) {
      throw Imports.EndingMessage.BlacklistChannelNotInDB;
    }
    const newChannelList = channelsList.replace(channel + ',', '');
    Imports.database.setBlacklist(msg.guild!, newChannelList);
    throw `Kanał o ID: ${channel} został pomyślnie usunięty`;
  } else {
    throw Imports.EndingMessage.BlacklistNullException;
  }
}

async function blacklist(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<void> {
  const msgAuthor = msg.member!;
  if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
    throw Imports.EndingMessage.NoPermissions;
  }
  const channelsList = await Imports.database.getBlacklist(msg.guild!);
  switch (args[1]) {
    case 'list': {
      ShowList(msg, channelsList);
      break;
    }
    case 'dodaj':
      addChannel(msg, channelsList);
      break;
    case 'usun': {
      deleteChannel(msg, args, channelsList);
      break;
    }
    default:
      throw Imports.EndingMessage.BlacklistArgsException;
  }
}
export default blacklist;

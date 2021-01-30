import * as Discord from 'discord.js';
import messages from './messages';
import database from './database';
import modules from './modules';
import Classified from './classified';

const bot = Classified.bot;

/* eslint-disable no-case-declarations */

async function getStats(): Promise<void> {
  const STATS_NAME: string[] = [
    'data',
    'czlonkowie',
    'online',
    'rekord',
    'bany',
    'dzien',
  ];

  const COLUMN_NAME: string[] = [
    'miejsce_daty',
    'miejsce_czlonkow',
    'miejsce_online',
    'miejsce_rekordu',
    'miejsce_banow',
    'miejsce_dnia',
  ];

  for (let i = 0; i < STATS_NAME.length; i++) {
    const [serverID, channelID, position] = await database.getStatistics(
      STATS_NAME[i],
      COLUMN_NAME[i]
    );

    await setStats(serverID, channelID, position, STATS_NAME[i]);
  }
}

async function setStats(
  serversID: string[],
  channelsID: string[],
  positions: number[],
  option: string
): Promise<void> {
  let time = await modules.setEndingDate('0m', 'text', true);
  time = time.slice(0, 10);
  time = time.replace(/-/g, '.');

  const DATE = new Date();
  const DAY_INDEX = DATE.getDay();
  const DAYS: string[] = [
    'Niedziela',
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
  ];

  const PRESENT_DAY = DAYS[DAY_INDEX];

  for (let i = 0; i < serversID.length; i++) {
    const server = bot.guilds.cache.get(serversID[i]);

    if (server) {
      const channel = server.channels.cache.get(channelsID[i]);

      if (channel) {
        let name = channel.name;
        const oldName = channel.name;
        const oldValue = name.slice(positions[i], name.length);
        name = name.slice(0, positions[i]);

        switch (option) {
          case 'data':
            name += time;
            break;

          case 'czlonkowie':
            let members = server.members.cache.size;
            const botMembers = server.members.cache.filter((m) => m.user.bot)
              .size;
            members -= botMembers;
            name += members;
            break;

          case 'online':
            const onlineMembers = countOnlineMembers(server);
            name += onlineMembers;
            break;

          case 'rekord':
            if (oldValue == '$' || oldValue == 'Błąd') {
              name += '0';
            } else {
              if (Number.isInteger(parseInt(oldValue))) {
                const onlineMembers = countOnlineMembers(server);
                if (parseInt(oldValue) < onlineMembers) {
                  name += onlineMembers;
                } else {
                  name = oldName;
                }
              } else {
                name += 'Błąd';
              }
            }
            break;

          case 'bany':
            const bannedUsers = await server.fetchBans();
            const amount = bannedUsers.size;
            name += amount;
            break;

          case 'dzien':
            name += PRESENT_DAY;
            break;
        }

        if (oldName != name) {
          channel.setName(name);
        }
      }
    }
  }
}

function countOnlineMembers(server: Discord.Guild): number {
  return (
    server.members.cache.filter((m) => m.user.presence.status === 'online')
      .size +
    server.members.cache.filter((m) => m.user.presence.status === 'dnd').size +
    server.members.cache.filter((m) => m.user.presence.status === 'idle').size -
    server.members.cache.filter((m) => m.user.bot).size
  );
}

async function autoRemoveLimitations(): Promise<void> {
  const MINUTE_PAUSE = 60000;

  while (true) {
    {
      const [serversID, usersID, warnsCount] = await database.getWarnedUsers();
      const ending = await modules.setEndingDate('3d', 'db', false);
      let i = 0;

      usersID.forEach(() => {
        const server = bot.guilds.cache.get(serversID[i]);

        if (server) {
          if (server.me!.hasPermission('ADMINISTRATOR')) {
            database.setWarn(serversID[i], usersID[i], ending, --warnsCount[i]);
          }
        }
        ++i;
      });
    }

    {
      const [serversID, usersID] = await database.getMutedUsers();
      let i = 0;

      usersID.forEach(() => {
        const server = bot.guilds.cache.get(serversID[i]);

        if (server) {
          if (server.me!.hasPermission('ADMINISTRATOR')) {
            const user = server.members.cache.get(usersID[i]);

            if (user) {
              const role = server.roles.cache.filter((r) => r.name === 'Muted');

              if (role) {
                database.unmute(user);
                user.roles.remove(role);
                database.getLogChannel(server.id).then((channelID) => {
                  const publicLogChannel = server!.channels.cache.get(
                    channelID
                  ) as Discord.TextChannel;
                  if (publicLogChannel) {
                    publicLogChannel.send(
                      `<@${user!.id}> został automatycznie odmutowany!`
                    );
                  }
                });
              }
            }
          }
        }
        ++i;
      });
    }

    {
      const [serversID, usersID] = await database.getBannedUsers();
      let i = 0;
      usersID.forEach(() => {
        const server = bot.guilds.cache.get(serversID[i]);
        if (server) {
          if (server.me?.hasPermission('ADMINISTRATOR')) {
            try {
              server.members.unban(usersID[i]);
            } catch (error) {
              console.error(error);
            }

            database.removeBan(server.id, usersID[i]);
          }
        }
        ++i;
      });
    }

    await modules.delay(MINUTE_PAUSE);
  }
}

async function statusBar(): Promise<void> {
  const BOT_VERSION = process.env.npm_package_version;
            
  while (true) {
    for (let i = 0; i < 3; i++) {
      switch (i) {
        case 0:
          bot.user?.setActivity(`🛠️Wersja: ${BOT_VERSION}`);
          break;

        case 1:
          bot.user?.setActivity('💎www.dziq.xyz');
          break;

        case 2:
          bot.user?.setActivity(`👀Serwery: ${bot.guilds.cache.size}`);
          break;
      }

      await modules.delay(10000);
    }
  }
}

const background = {
  async statistics(): Promise<void> {
    while (true) {
      getStats();
      const DISCORD_API_LIMIT = 300000;
      await modules.delay(DISCORD_API_LIMIT);
    }
  },

  async waitAndDelete(message: Discord.Message, ms: number): Promise<void> {
    await modules.delay(ms);
    message.delete();
  },

  drd(oldMessage: Discord.Message, newMessage: string): void {
    try {
      oldMessage.reply(newMessage).then((message) => {
        oldMessage.delete();
        background.waitAndDelete(message, 10000);
      });
    } catch (err) {
      console.debug(err);
    }
  },

  async animation(msg: Discord.Message): Promise<void> {
    let dynamicText: string;
    dynamicText = '✨ Dziki ✨';
    msg.edit(dynamicText);
    await modules.delay(3000);
    dynamicText = '✨ BOT ✨';
    msg.edit(dynamicText);
    await modules.delay(3000);
    dynamicText = '✨Dziki BOT';
    msg.edit(dynamicText);
    await modules.delay(3000);
    for (let i = 15; i > 0; i--) {
      dynamicText = dynamicText.slice(1, dynamicText.length);
      msg.edit(dynamicText);
      await modules.delay(2000);
    }
  },

  sendDMmessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember,
    option: number
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let delivered: boolean;

      switch (option) {
        case 1:
          messages.kickDMMessage(msg, args, subject).then((kickMessage) => {
            subject
              .send(kickMessage)
              .then(() => {
                delivered = true;
                resolve(delivered);
              })
              .catch(() => {
                delivered = false;
                resolve(delivered);
              });
          });
          break;

        case 2:
          messages.banDMMessage(msg, args, subject).then((kickMessage) => {
            subject
              .send(kickMessage)
              .then(() => {
                delivered = true;
                resolve(delivered);
              })
              .catch(() => {
                delivered = false;
                resolve(delivered);
              });
          });
          break;

        case 3:
          messages
            .tempBanDMMessage(msg, args, subject)
            .then((tempBanMessage) => {
              subject
                .send(tempBanMessage)
                .then(() => {
                  delivered = true;
                  resolve(delivered);
                })
                .catch(() => {
                  delivered = false;
                  resolve(delivered);
                });
            });
          break;
      }
    });
  },

  formatMessage(message: string): string {
    return '```' + message + '```';
  },
};

bot.on('guildMemberAdd', (newMember) => {
  const server = newMember.guild;

  database.muteCheck(newMember).then(() => {
    const role = server.roles.cache.find((r) => r.name === 'Muted');
    if (role) {
      newMember.roles.add(role);
    }
  });

  database.getPrivateLogChannel(server.id).then((channelID) => {
    const logChannel = server.channels.cache.get(
      channelID
    ) as Discord.TextChannel;
    if (logChannel) {
      messages.joinLogsMessage(newMember).then((joinMessage) => {
        logChannel.send(joinMessage);
      });
    }
  });
});

bot.on('guildMemberRemove', (oldMember) => {
  const server = oldMember.guild;
  database.getPrivateLogChannel(server.id).then((channelID) => {
    const logChannel = server.channels.cache.get(
      channelID
    ) as Discord.TextChannel;

    if (logChannel) {
      messages
        .leaveLogsMessage(oldMember as Discord.GuildMember)
        .then((leaveMessage) => {
          logChannel.send(leaveMessage);
        });
    }
  });
});

bot.on('messageUpdate', async (oldMessage, newMessage) => {
  const channelsList = await database.getBlacklist(oldMessage.guild!);

  if (channelsList) {
    const channels: string[] = channelsList.split(',');
    channels.pop(); // last index of table is always ','

    if (
      oldMessage.channel.type != 'dm' &&
      !oldMessage.author!.bot &&
      channels.indexOf(oldMessage.channel.id) == -1
    ) {
      const server = newMessage.guild;
      database.getPrivateLogChannel(server!.id).then((channelID) => {
        const logChannel = server!.channels.cache.get(
          channelID
        ) as Discord.TextChannel;

        if (logChannel) {
          messages
            .editLogsMessage(
              oldMessage as Discord.Message,
              newMessage as Discord.Message
            )
            .then((editMessage) => {
              logChannel.send(editMessage);
            });
        }
      });
    }
  } else {
    if (oldMessage.channel.type != 'dm' && !oldMessage.author!.bot) {
      const server = newMessage.guild;

      database.getPrivateLogChannel(server!.id).then((channelID) => {
        const logChannel = server!.channels.cache.get(
          channelID
        ) as Discord.TextChannel;

        if (logChannel) {
          messages
            .editLogsMessage(
              oldMessage as Discord.Message,
              newMessage as Discord.Message
            )
            .then((editMessage) => {
              logChannel.send(editMessage);
            });
        }
      });
    }
  }
});

bot.on('messageDelete', async (deletedMessage) => {
  const channelsList = await database.getBlacklist(deletedMessage.guild!);

  if (channelsList) {
    const channels: string[] = channelsList.split(',');
    channels.pop(); // last index of table is always ','

    if (
      deletedMessage.channel.type != 'dm' &&
      !deletedMessage.author!.bot &&
      channels.indexOf(deletedMessage.channel.id) == -1
    ) {
      const server = deletedMessage.guild;
      database.getPrivateLogChannel(server!.id).then((channelID) => {
        const logchannel = server!.channels.cache.get(
          channelID
        ) as Discord.TextChannel;
        if (logchannel) {
          messages
            .deleteLogsMessage(deletedMessage as Discord.Message)
            .then((deleteMessage) => {
              logchannel.send(deleteMessage);
            });
        }
      });
    }
  } else {
    if (deletedMessage.channel.type != 'dm' && !deletedMessage.author!.bot) {
      const server = deletedMessage.guild;

      database.getPrivateLogChannel(server!.id).then((channelID) => {
        const logchannel = server!.channels.cache.get(
          channelID
        ) as Discord.TextChannel;

        if (logchannel) {
          messages
            .deleteLogsMessage(deletedMessage as Discord.Message)
            .then((deleteMessage) => {
              logchannel.send(deleteMessage);
            });
        }
      });
    }
  }
});

bot.on('ready', () => {
  background.statistics();
  autoRemoveLimitations();
  statusBar();
});

export default background;

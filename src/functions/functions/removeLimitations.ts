import { Discord, bot, modules, database } from '../import';

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
              const role = server.roles.cache.filter(r => r.name === 'Muted');

              if (role) {
                database.setUnmute(user);
                user.roles.remove(role);
                database.getPublicLogChannel(server.id).then(channelID => {
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
            database.setUnban(server.id, usersID[i]);
          }
        }
        ++i;
      });
    }

    await modules.delay(MINUTE_PAUSE);
  }
}
export default autoRemoveLimitations;

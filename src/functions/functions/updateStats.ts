import { Discord, bot, modules, database } from '../import';

async function getStats(): Promise<void> {
  while (true) {
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
    const DISCORD_API_LIMIT = 300000;
    await modules.delay(DISCORD_API_LIMIT);
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
          case 'data': {
            name += time;
            break;
          }

          case 'czlonkowie': {
            let members = server.members.cache.size;
            const botMembers = server.members.cache.filter(m => m.user.bot)
              .size;
            members -= botMembers;
            name += members;
            break;
          }

          case 'online': {
            const onlineMembers = countOnlineMembers(server);
            name += onlineMembers;
            break;
          }

          case 'rekord': {
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
          }

          case 'bany': {
            const bannedUsers = await server.fetchBans();
            const amount = bannedUsers.size;
            name += amount;
            break;
          }

          case 'dzien': {
            name += PRESENT_DAY;
            break;
          }
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
    server.members.cache.filter(m => m.user.presence.status === 'online').size +
    server.members.cache.filter(m => m.user.presence.status === 'dnd').size +
    server.members.cache.filter(m => m.user.presence.status === 'idle').size -
    server.members.cache.filter(m => m.user.bot).size
  );
}
export default getStats;

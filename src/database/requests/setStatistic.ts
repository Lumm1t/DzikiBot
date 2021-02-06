import * as Imports from '../import';

async function setStatistic(
  msg: Imports.Discord.Message,
  arg: string,
  channel: Imports.Discord.GuildChannel
): Promise<void> {
  const [statistics] = await Imports.models.stats.findOrCreate({
    where: {
      serwer: msg.guild!.id,
    },
    defaults: {
      serwer: msg.guild!.id,
    },
  });
  return new Promise((resolve, reject) => {
    const insertStat = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      statistics: Imports.Seq.Model<any, any>,
      channelId: string,
      position: number,
      statName: string,
      statPos: string
    ) => {
      statistics.set(statName, channelId);
      statistics.set(statPos, position);
    };
    const position = channel.name.indexOf('$');
    if (position != -1) {
      switch (arg) {
        case 'data':
          insertStat(statistics, channel.id, position, 'data', 'miejsce_daty');
          break;
        case 'czlonkowie':
          insertStat(
            statistics,
            channel.id,
            position,
            'czlonkowie',
            'miejsce_czlonkow'
          );
          break;
        case 'online':
          insertStat(
            statistics,
            channel.id,
            position,
            'online',
            'miejsce_online'
          );
          break;
        case 'rekord_online':
          insertStat(
            statistics,
            channel.id,
            position,
            'rekord',
            'miejsce_rekordu'
          );
          break;
        case 'bany':
          insertStat(statistics, channel.id, position, 'bany', 'miejsce_banow');
          break;
        case 'dzien':
          insertStat(statistics, channel.id, position, 'dzien', 'miejsce_dnia');
          break;
        default:
          reject('Nie mam informacji o takiej statystyce :c');
          break;
      }
      statistics.save();
      resolve();
    } else {
      reject("W nazwie kanału musi zawierać się znak '$'");
    }
  });
}
export default setStatistic;

import * as Imports from '../import';

async function getStatistics(
  option: string,
  name: string
): Promise<[string[], string[], number[]]> {
  const serverID: string[] = [];
  const channelID: string[] = [];
  const position: number[] = [];
  const statistics = await Imports.models.stats.findAll({
    where: {
      [option]: { [Imports.Seq.Op.ne]: null },
    },
  });
  let i = 0;
  statistics.forEach(element => {
    serverID[i] = element.get('serwer') as string;
    channelID[i] = element.get(option) as string;
    position[i] = element.get(name) as number;
    ++i;
  });
  return new Promise<[string[], string[], number[]]>(resolve => {
    resolve([serverID, channelID, position]);
  });
}
export default getStatistics;

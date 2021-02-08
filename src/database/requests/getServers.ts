import { models, Seq } from '../import';

async function getServers(): Promise<string> {
  let server = '';
  const guilds = await models.servers.findAll({
    where: {
      serwer: { [Seq.Op.ne]: '0' },
      logi2: { [Seq.Op.ne]: null },
    },
  });
  guilds.forEach(data => {
    server += data.get('serwer') + ',' + data.get('logi2') + ':';
  });

  return new Promise<string>(resolve => {
    server = server.slice(0, -1);
    resolve(server);
  });
}
export default getServers;

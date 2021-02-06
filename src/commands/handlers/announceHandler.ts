import * as Imports from '../import';

const bot = Imports.Classified.bot;

async function announce(
  msg: Imports.Discord.Message,
  args: string[]
): Promise<void> {
  if (msg.member!.id == '355043764861140993') {
    let reason = '';
    for (let i = 1; i < args.length; i++) {
      reason += args[i] + ' ';
    }
    const serversRow = await Imports.database.getServers();
    const servers = serversRow.split(':');
    servers.forEach(element => {
      const args = element.split(',');
      const serverID = args[0];
      const channelID = args[1];
      const server = bot.guilds.cache.get(serverID);
      if (server) {
        const channel = server.channels.cache.get(
          channelID
        ) as Imports.Discord.TextChannel;
        if (channel) {
          channel.send(
            `**@here Wiadomość od autora: **${Imports.background.formatMessage(
              reason
            )}`
          );
        }
      }
    });
  }
}
export default announce;

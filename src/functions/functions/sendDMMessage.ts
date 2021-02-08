import { Discord, messages } from '../import';

async function sendDMMessage(
  msg: Discord.Message,
  args: string[],
  subject: Discord.GuildMember,
  option: number
): Promise<boolean> {
  let message: Discord.MessageEmbed;
  switch (option) {
    case 1:
      message = await messages.kickDMMessage(msg, args, subject);
      break;
    case 2:
      message = await messages.banDMMessage(msg, args, subject);
      break;
    case 3:
      message = await messages.tempBanDMMessage(msg, args, subject);
      break;
  }
  return new Promise<boolean>(resolve => {
    let delivered: boolean;
    subject
      .send(message)
      .then(() => {
        delivered = true;
        resolve(delivered);
      })
      .catch(() => {
        delivered = false;
        resolve(delivered);
      });
  });
}
export default sendDMMessage;

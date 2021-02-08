import { Discord, modules } from '../import';

function reply(oldMessage: Discord.Message, newMessage: string): void {
  try {
    oldMessage.reply(newMessage).then(message => {
      oldMessage.delete().then();
      waitAndDelete(message, 10000).then();
    });
  } catch (err) {
    console.log('');
  }
}

async function waitAndDelete(
  message: Discord.Message,
  ms: number
): Promise<void> {
  await modules.delay(ms);
  await message.delete();
}
export { reply, waitAndDelete };

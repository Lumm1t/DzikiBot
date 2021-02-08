import { bot, modules } from '../import';

async function setStatusBar(): Promise<void> {
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
export default setStatusBar;

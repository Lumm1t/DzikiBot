import * as Discord from 'discord.js';
import modules from './modules';
import Classified from './classified';
import models from './seqModels';
import * as Seq from 'sequelize';

const classified = Classified.classified;
const con = classified.getCon();
const seq = classified.getSeq();

try {
  seq.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

con.connect(function (err: Error) {
  if (err) throw err;
  console.log('Connected to SQL!');
});

const database = {
  async getLogChannel(serverID: string): Promise<string> {
    const guild = await models.servers.findOne({
      where: {
        serwer: serverID,
      },
    });

    return new Promise<string>(resolve => {
      if (guild) {
        const channelID = guild.get('logi') as string;
        resolve(channelID);
      } else {
        resolve('');
      }
    });
  },

  async getPrivateLogChannel(serverID: string): Promise<string> {
    const guild = await models.servers.findOne({
      where: {
        serwer: serverID,
      },
    });

    return new Promise<string>(resolve => {
      if (guild) {
        const channelID = guild.get('logi2') as string;
        resolve(channelID);
      } else {
        resolve('');
      }
    });
  },

  async setPublicLogs(
    msg: Discord.Message,
    channel: Discord.GuildChannel
  ): Promise<void> {
    const [guild] = await models.servers.findOrCreate({
      where: {
        serwer: msg.guild!.id,
      },
      defaults: {
        serwer: msg.guild!.id,
        prefix: 0,
        logi: channel.id,
        warn: '12h',
      },
    });
    if (guild) {
      guild.set('logi', channel.id);
      guild.save();
    }
  },

  async muteCheck(newMember: Discord.GuildMember): Promise<string> {
    const user = await models.users.findOne({
      where: {
        serwer: newMember.guild.id,
        uzytkownik: newMember.id,
      },
    });
    return new Promise<string>(resolve => {
      if (user) {
        const date = user.get('data_zakonczenia_muta') as string;
        console.log(date);
        if (!(date == '0' || date == null)) resolve('');
      }
    });
  },

  async setPrivateLogs(
    msg: Discord.Message,
    channel: Discord.GuildChannel
  ): Promise<void> {
    const guild = await models.servers.findOne({
      where: {
        serwer: msg.guild!.id,
      },
    });
    if (guild) {
      guild.set('logi2', channel.id);
      guild.save();
    }
  },

  async mute(msg: Discord.Message, arg: string): Promise<string> {
    const ending = await modules.setEndingDate(arg, 'db', false);
    const subject = msg.mentions.members!.first()!;
    const [user] = await models.users.findOrCreate({
      where: {
        serwer: msg.guild!.id,
        uzytkownik: subject.id,
      },
      defaults: {
        serwer: msg.guild!.id,
        uzytkownik: subject.id,
        data_zakonczenia_muta: ending,
      },
    });
    return new Promise<string>(resolve => {
      user.set('data_zakonczenia_muta', ending);
      user.save();
      resolve('');
    });
  },

  async unmute(subject: Discord.GuildMember): Promise<void> {
    const user = await models.users.findOne({
      where: {
        serwer: subject.guild.id,
        uzytkownik: subject.id,
      },
    });
    if (user) {
      user.set('data_zakonczenia_muta', 0);
      user.save();
    }
  },

  async tempBan(msg: Discord.Message, args: string[]): Promise<string> {
    const ending = await modules.setEndingDate(args[2], 'db', false);
    const subject = msg.mentions.members!.first()!;
    const [user] = await models.users.findOrCreate({
      where: {
        serwer: msg.guild!.id,
        uzytkownik: subject.id,
      },
      defaults: {
        serwer: msg.guild!.id,
        uzytkownik: subject.id,
        data_zakonczenia_bana: ending,
      },
    });
    return new Promise<string>(resolve => {
      if (user) {
        user.set('data_zakonczenia_bana', ending);
        user.save();
        resolve('');
      }
    });
  },

  async removeBan(serverID: string, userID: string): Promise<void> {
    const user = await models.users.findOne({
      where: {
        serwer: serverID,
        uzytkownik: userID,
      },
    });
    if (user) {
      user.set('data_zakonczenia_bana', 0);
      user.save();
    }
  },

  async warn(subject: Discord.GuildMember, ending: string): Promise<number> {
    const [user] = await models.users.findOrCreate({
      where: {
        serwer: subject.guild.id,
        uzytkownik: subject.id,
      },
      defaults: {
        serwer: subject.guild.id,
        uzytkownik: subject.id,
        ilosc_warnow: '0',
        data_zakonczenia: ending,
      },
    });
    return new Promise<number>(resolve => {
      if (user) {
        let warnCount = user.get('ilosc_warnow') as number;
        warnCount++;
        if (warnCount == 4) warnCount--;
        user.set('ilosc_warnow', warnCount);
        user.set('data_zakonczenia', ending);
        user.save();
        resolve(warnCount);
      }
    });
  },

  async setWarn(
    serverID: string,
    subjectID: string,
    ending: string,
    warnCount: number
  ): Promise<void> {
    const user = await models.users.findOne({
      where: {
        serwer: serverID,
        uzytkownik: subjectID,
      },
    });
    return new Promise(() => {
      if (user) {
        if (warnCount == 0) {
          user.set('data_zakonczenia', 0);
          user.set('ilosc_warnow', 0);
        } else {
          user.set('data_zakonczenia', ending);
          user.set('ilosc_warnow', warnCount);
        }
        user.save();
      }
    });
  },

  async warnTime(msg: Discord.Message): Promise<string> {
    const guild = await models.servers.findOne({
      where: {
        serwer: msg.guild!.id,
      },
    });
    return new Promise<string>(resolve => {
      if (guild) {
        const time = guild.get('warn') as string;
        resolve(time);
      }
    });
  },

  async setAutoMuteTime(msg: Discord.Message, args: string[]): Promise<string> {
    const guild = await models.servers.findOne({
      where: {
        serwer: msg.guild!.id,
      },
    });
    return new Promise<string>(resolve => {
      if (guild) {
        guild.set('warn', args[1]);
        guild.save();
        resolve('');
      }
    });
  },

  async setStatistic(
    msg: Discord.Message,
    arg: string,
    channel: Discord.GuildChannel
  ): Promise<void> {
    const [statistics] = await models.stats.findOrCreate({
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
        statistics: Seq.Model<any, any>,
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
            insertStat(
              statistics,
              channel.id,
              position,
              'data',
              'miejsce_daty'
            );
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
            insertStat(
              statistics,
              channel.id,
              position,
              'bany',
              'miejsce_banow'
            );
            break;
          case 'dzien':
            insertStat(
              statistics,
              channel.id,
              position,
              'dzien',
              'miejsce_dnia'
            );
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
  },

  async getStatistics(
    option: string,
    name: string
  ): Promise<[string[], string[], number[]]> {
    const serverID: string[] = [];
    const channelID: string[] = [];
    const position: number[] = [];
    const statistics = await models.stats.findAll({
      where: {
        [option]: { [Seq.Op.ne]: null },
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
  },

  async getBlacklist(server: Discord.Guild): Promise<string> {
    const guild = await models.servers.findOne({
      where: {
        serwer: server.id,
      },
    });
    return new Promise<string>(resolve => {
      if (guild) {
        const channels = guild.get('blacklist') as string;
        resolve(channels);
      }
    });
  },

  async setBlacklist(server: Discord.Guild, channels: string): Promise<void> {
    const guild = await models.servers.findOne({
      where: {
        serwer: server.id,
      },
    });
    if (guild) {
      guild.set('blacklist', channels);
      guild.save();
    }
  },

  async Announcement(): Promise<string> {
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
  },

  async getWarnedUsers(): Promise<[string[], string[], number[]]> {
    const time = await modules.setEndingDate('0m', 'db', true);
    const serversID: string[] = [];
    const usersID: string[] = [];
    const warnsCount: number[] = [];
    const users = await models.users.findAll({
      where: {
        data_zakonczenia: {
          [Seq.Op.and]: [{ [Seq.Op.ne]: 0 }, { [Seq.Op.lte]: time }],
        },
      },
    });
    let i = 0;
    users.forEach(element => {
      serversID[i] = element.get('serwer') as string;
      usersID[i] = element.get('uzytkownik') as string;
      warnsCount[i] = element.get('ilosc_warnow') as number;
      ++i;
    });
    return new Promise<[string[], string[], number[]]>(resolve => {
      resolve([serversID, usersID, warnsCount]);
    });
  },

  async getMutedUsers(): Promise<[string[], string[]]> {
    const time = await modules.setEndingDate('0m', 'db', true);
    const serversID: string[] = [];
    const usersID: string[] = [];
    const users = await models.users.findAll({
      where: {
        data_zakonczenia_muta: {
          [Seq.Op.and]: [{ [Seq.Op.ne]: 0 }, { [Seq.Op.lte]: time }],
        },
      },
    });
    let i = 0;
    users.forEach(element => {
      serversID[i] = element.get('serwer') as string;
      usersID[i] = element.get('uzytkownik') as string;
      ++i;
    });
    return new Promise<[string[], string[]]>(resolve => {
      resolve([serversID, usersID]);
    });
  },

  async getBannedUsers(): Promise<[string[], string[]]> {
    const time = await modules.setEndingDate('0m', 'db', true);
    const serversID: string[] = [];
    const usersID: string[] = [];
    const users = await models.users.findAll({
      where: {
        data_zakonczenia_bana: {
          [Seq.Op.and]: [{ [Seq.Op.ne]: 0 }, { [Seq.Op.lte]: time }],
        },
      },
    });
    let i = 0;
    users.forEach(element => {
      serversID[i] = element.get('serwer') as string;
      usersID[i] = element.get('uzytkownik') as string;
      ++i;
    });
    return new Promise<[string[], string[]]>(resolve => {
      resolve([serversID, usersID]);
    });
  },
};
export default database;

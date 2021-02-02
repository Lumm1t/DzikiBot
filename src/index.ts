import * as Discord from 'discord.js';
import messages from './messages';
import database from './database';
import modules from './modules';
import Classified from './classified';
import background from './background';

/* eslint-disable no-case-declarations */

const bot = Classified.bot;

enum EndingMessage {
  NoPermissions = 'Nie masz uprawnień',
  NoPermissionOrUserIsAdmin = 'Nie masz uprawnień lub osoba jest administratorem.',
  IncorrectUserData = 'Nie podano użytkownika lub go nie znaleziono :c',
  MutedRoleNotFound = "Nie znaleziono roli 'Muted', stwórz ją żebym mógł wykonać swoje zadanie.",
  NoAccessToLogChannel = 'Kanał z publicznymi logami nie istnieje lub nie mam do niego dostępu, żebym mógł pracować musisz to naprawić. Jeśli nie wiesz jak to zrobić wpisz $pomoc',
  SuccessfulSetPublicLogs = 'Udane ustawienie publicznych logów na kanał: ',
  BlacklistArgsException = 'komenda blacklist przyjmuje 3 arugmenty: list, dodaj, usun',
  BlacklistLengthException = 'Osiągnąłeś limit kanałów w blackliście (50), spróbuj usunąć jakieś kanały z blacklisty',
  BlacklistchannelException = 'Nie oznaczyłeś kanału lub nie jest on kanałem tekstowym',
  BlacklistChannelInDB = 'Kanał jest już w bazie danych',
  BlacklistChannelNotInDB = 'Kanał nie znajduję się w bazie danych',
  BlacklistChannelAdded = 'Kanał pomyślnie został dodany do blacklisty',
  BlacklistNullException = 'Nie dodałeś jeszcze żadnego kanału do blacklisty',
  MentionArgException = 'Nie podałeś ile razy mam kogoś oznaczyć.',
  MentionNumberException = 'Podana liczba musi być w przedziale [1-99] albo to co podałeś nie jest liczbą',
  DocsMessage = 'Wszelkie komendy i ich zastosowanie możesz znaleźć tutaj: https://github.com/MrDzik/DzikiBot/blob/main/README.md',
}
bot.on('message', msg => {
  if (msg.content.startsWith('$') && !msg.member!.user.bot) {
    msgProcessor(msg);
  }
});

async function msgProcessor(msg: Discord.Message) {
  // variables that are commonly used
  const command = msg.content.substring(1);
  const args = command.split(' ');
  const subject = msg.mentions.members?.first();
  let delivered: boolean;
  const msgAuthor = msg.member!;

  try {
    if (msg.channel.type == 'dm') {
      throw 'Nie przyjmuję zleceń w wiadomościach prywatnych 👿';
    }

    if (!msg.guild!.me!.hasPermission('ADMINISTRATOR')) {
      throw 'Potrzebuję uprawnień administratora do poprawnego działania.';
    }

    const channelID = await database.getLogChannel(msg.guild!.id);
    const channel = bot.channels.cache.get(channelID);

    if (args[0] == 'publicznelogi') {
      if (!msg.member!.hasPermission('ADMINISTRATOR')) {
        throw EndingMessage.NoPermissions;
      }

      const channel = msg.mentions.channels.first();

      if (!channel || channel.type != 'text') {
        throw 'Musisz oznaczyć kanał tekstowy. $publicznelogi #kanał';
      }

      database.setPublicLogs(msg, channel);
      throw EndingMessage.SuccessfulSetPublicLogs + channel.name;
    } else if (args[0] == 'pomoc' || args[0] == 'help') {
      throw EndingMessage.DocsMessage;
    }

    if (channel == undefined) {
      throw EndingMessage.NoAccessToLogChannel;
    }
    const publicLogChannel = channel as Discord.TextChannel;
    switch (args[0]) {
      case 'kick':
        if (
          !msgAuthor.hasPermission('KICK_MEMBERS') ||
          subject?.hasPermission('ADMINISTRATOR')
        ) {
          throw EndingMessage.NoPermissionOrUserIsAdmin;
        }

        if (!subject) {
          throw EndingMessage.IncorrectUserData;
        }

        delivered = await background.sendDMmessage(msg, args, subject, 1);
        const kickMessage = await messages.kickServerMessage(
          msg,
          args,
          subject,
          delivered
        );
        publicLogChannel.send(kickMessage);
        subject.kick();
        background.waitAndDelete(msg, 10000);
        break;

      case 'ban':
        if (
          !msgAuthor.hasPermission('BAN_MEMBERS') ||
          subject?.hasPermission('ADMINISTRATOR')
        ) {
          throw EndingMessage.NoPermissionOrUserIsAdmin;
        }

        if (!subject) {
          throw EndingMessage.IncorrectUserData;
        }

        delivered = await background.sendDMmessage(msg, args, subject, 2);
        const banMessage = await messages.banServerMessage(
          msg,
          args,
          subject,
          delivered
        );

        publicLogChannel.send(banMessage);
        subject.ban();
        background.waitAndDelete(msg, 10000);
        break;

      case 'mute': {
        const role = msg.guild!.roles.cache.find(r => r.name === 'Muted');
        if (!msgAuthor.hasPermission('MANAGE_MESSAGES')) {
          throw EndingMessage.NoPermissions;
        }

        if (!subject) {
          throw EndingMessage.IncorrectUserData;
        }

        if (role == undefined) {
          throw EndingMessage.MutedRoleNotFound;
        }

        if (args[2] == null) {
          const muteMessage = await messages.permMuteMessage(msg, subject);
          subject.roles.add(role);
          publicLogChannel.send(muteMessage);
          background.waitAndDelete(msg, 10000);
        } else {
          await database.mute(msg, args[2]);
          subject.roles.add(role);
          const muteMessage = await messages.muteMessage(msg, args, subject);
          publicLogChannel.send(muteMessage);
          background.waitAndDelete(msg, 10000);
        }
        break;
      }

      case 'unmute': {
        const role = msg.guild!.roles.cache.find(r => r.name === 'Muted');
        if (!msgAuthor.hasPermission('MANAGE_MESSAGES')) {
          throw EndingMessage.NoPermissions;
        }

        if (!subject) {
          throw EndingMessage.IncorrectUserData;
        }

        if (role == undefined) {
          throw EndingMessage.MutedRoleNotFound;
        }

        subject.roles.remove(role);
        publicLogChannel.send(
          `<@${subject!.id}> został odmutowany przez: <@${msg.member!.id}>!`
        );
        database.unmute(subject);
        background.waitAndDelete(msg, 10000);
        break;
      }

      case 'tempban':
        if (
          !msgAuthor.hasPermission('KICK_MEMBERS') ||
          subject?.hasPermission('ADMINISTRATOR')
        ) {
          throw EndingMessage.NoPermissionOrUserIsAdmin;
        }

        if (!subject) {
          throw EndingMessage.IncorrectUserData;
        }

        await database.tempBan(msg, args);
        delivered = await background.sendDMmessage(msg, args, subject, 3);
        const tempBanMessage = await messages.tempBanMessage(
          msg,
          args,
          subject,
          delivered
        );

        publicLogChannel.send(tempBanMessage);
        subject.ban();
        background.waitAndDelete(msg, 10000);
        break;

      case 'warn': {
        const role = msg.guild!.roles.cache.find(r => r.name === 'Muted');
        if (!msgAuthor.hasPermission('MANAGE_MESSAGES')) {
          throw EndingMessage.NoPermissions;
        }

        if (!subject) {
          throw EndingMessage.IncorrectUserData;
        }

        if (role == undefined) {
          throw EndingMessage.MutedRoleNotFound;
        }

        const time = await modules.setEndingDate('3d', 'db', false);
        const warnCount = await database.warn(subject, time);

        if (warnCount != 3) {
          const warnMessage = await messages.warnMessage(
            msg,
            args,
            subject,
            warnCount,
            '0'
          );
          publicLogChannel.send(warnMessage);
          background.waitAndDelete(msg, 10000);
        } else {
          const muteTime = await database.warnTime(msg);
          let date = await modules.setEndingDate(muteTime, 'text', true);

          if (!['0m', '0h', '0d'].includes(muteTime)) {
            database.mute(msg, muteTime);
            subject.roles.add(role);
          } else {
            date = '0';
          }

          const warnMessage = await messages.warnMessage(
            msg,
            args,
            subject,
            warnCount,
            date
          );
          publicLogChannel.send(warnMessage);
        }
        break;
      }

      case 'mutetime':
        if (msgAuthor.hasPermission('ADMINISTRATOR')) {
          await modules.setEndingDate(args[1], 'text', true);
          await database.setAutoMuteTime(msg, args);
          background.drd(
            msg,
            'Czas muta po 3 warnach został pomyślnie ustawiony na: ' + args[1]
          );
        }
        break;

      case 'prywatnelogi':
        if (msgAuthor.hasPermission('ADMINISTRATOR')) {
          const channel = msg.mentions.channels.first();
          if (channel) {
            if (channel.type == 'text') {
              database.setPrivateLogs(msg, channel);
              background.drd(
                msg,
                'Udane ustawienie prywatnych logów na kanał: ' + channel.name
              );
            }
          } else {
            background.drd(
              msg,
              'Musisz oznaczyć kanał tekstowy. $prywatnelogi #kanał'
            );
          }
        }
        break;

      case 'statystyki':
        if (msgAuthor.hasPermission('ADMINISTRATOR')) {
          const channelID = args[2];
          const channel = msg.guild?.channels.cache.get(channelID);
          if (channel) {
            if (channel.type == 'voice') {
              await database.setStatistic(msg, args[1], channel);
              background.drd(
                msg,
                'Udane ustawienie statystyki na: ' + channel.name
              );
            } else {
              background.drd(msg, 'Podany kanał musi być kanałem głosowym');
            }
          } else {
            background.drd(msg, 'Błędne ID kanału');
          }
        } else {
          background.drd(msg, 'Nie posiadasz uprawnień');
        }
        break;

      case 'blacklist':
        if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
          throw EndingMessage.NoPermissions;
        }
        const channelsList = await database.getBlacklist(msg.guild!);
        switch (args[1]) {
          case 'list': {
            if (channelsList) {
              const channels: string[] = channelsList.split(',');
              channels.pop(); // last index of table is always ','
              let message = 'NUMER : ID : NAZWA\n';
              let i = 1;
              const MESSAGE_LENGTH_LIMIT = 25;
              channels.forEach(channelID => {
                const channel = msg.guild!.channels.cache.get(
                  channelID
                ) as Discord.TextChannel;
                if (channel) {
                  message += `${i}. : ${channel.id} : ${channel.name}\n`;
                } else {
                  message += `${i}. : ${channelID} : Nie znaleziono kanału\n`;
                }
                if (i == MESSAGE_LENGTH_LIMIT) {
                  msg.channel.send(background.formatMessage(message));
                  message = '';
                }
                i++;
              });
              msg.channel.send(background.formatMessage(message));
            } else {
              throw EndingMessage.BlacklistNullException;
            }
            break;
          }

          case 'dodaj': {
            const channel = msg.mentions.channels.first();
            if (!channel || channel.type != 'text') {
              throw EndingMessage.BlacklistchannelException;
            }
            if (channelsList) {
              const channels: string[] = channelsList.split(',');
              if (channels.length > 49) {
                throw EndingMessage.BlacklistLengthException;
              }
              if (channels.indexOf(channel.id) != -1) {
                throw EndingMessage.BlacklistChannelInDB;
              }
              database.setBlacklist(
                msg.guild!,
                channelsList + channel.id + ','
              );
            } else {
              database.setBlacklist(msg.guild!, channel.id + ',');
            }
            throw EndingMessage.BlacklistChannelAdded;
          }

          case 'usun': {
            if (channelsList) {
              const channels: string[] = channelsList.split(',');
              const channel = args[2];
              if (channels.indexOf(channel) == -1) {
                throw EndingMessage.BlacklistChannelNotInDB;
              }
              const newChannelList = channelsList.replace(channel + ',', '');
              database.setBlacklist(msg.guild!, newChannelList);
              throw `Kanał o ID: ${channel} został pomyślnie usunięty`;
            } else {
              throw EndingMessage.BlacklistNullException;
            }
          }
          default:
            throw EndingMessage.BlacklistArgsException;
        }
        break;
      case 'mention':
        const member = msg.mentions.members?.first();
        if (!msgAuthor.hasPermission('ADMINISTRATOR')) {
          throw EndingMessage.NoPermissions;
        }
        if (!member) {
          throw EndingMessage.IncorrectUserData;
        }
        if (!args[2]) {
          throw EndingMessage.MentionArgException;
        }
        if (!/^[1-9][0-9]?$/i.test(args[2])) {
          throw EndingMessage.MentionNumberException;
        }
        let reason = '';
        for (let i = 3; i < args.length; i++) {
          reason += args[i] + ' ';
        }
        for (let i = 0; i < Number(args[2]); i++) {
          msg.channel.send(`${member} ${reason}`);
          await modules.delay(2000);
        }
        break;
      case 'ogłoś':
        if (msg.member!.id == '355043764861140993') {
          let reason = '';
          for (let i = 1; i < args.length; i++) {
            reason += args[i] + ' ';
          }
          const serversRow = await database.Announcement();
          const servers = serversRow.split(':');
          servers.forEach(element => {
            const args = element.split(',');
            const serverID = args[0];
            const channelID = args[1];
            const server = bot.guilds.cache.get(serverID);
            if (server) {
              const channel = server.channels.cache.get(
                channelID
              ) as Discord.TextChannel;
              if (channel) {
                channel.send(
                  `**@here Wiadomość od autora: **${background.formatMessage(
                    reason
                  )}`
                );
              }
            }
          });
        }
        break;
    }
  } catch (err) {
    if (msg.channel.type != 'dm') {
      const reason = '$ ' + err + ' //';
      background.drd(msg, reason);
    } else {
      msg.reply(err);
    }
  }
}

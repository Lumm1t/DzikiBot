import * as Discord from 'discord.js';
import modules from './modules';
import classified from './classified';

const bot = classified.bot;

const messages = {
  getDMEmojiStatus(isSuccessful: boolean): string {
    return isSuccessful ? '✅' : '❌';
  },

  kickServerMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember,
    delivered: boolean
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      const del: string = this.getDMEmojiStatus(delivered);
      for (let i = 2; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      const kickMessage = new Discord.MessageEmbed()
        .setColor('#f74b07')
        .setTitle('Kick')
        .setThumbnail(subject!.user.avatarURL()!)
        .addFields(
          { name: 'Powód: ', value: reason },
          { name: '\u200B', value: '\u200B' },
          { name: 'Zkickowany: ', value: `${subject?.user.tag}`, inline: true },
          { name: 'Kickujący: ', value: `<@${msg.member!.id}>`, inline: true },
          { name: 'DM dostarczony: ', value: del }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(kickMessage);
    });
  },

  banServerMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember,
    delivered: boolean
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      const del: string = this.getDMEmojiStatus(delivered);
      for (let i = 2; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      const banMessage = new Discord.MessageEmbed()
        .setColor('#f70707')
        .setTitle('Permban')
        .setThumbnail(subject!.user.avatarURL()!)
        .addFields(
          { name: 'Powód: ', value: reason },
          { name: '\u200B', value: '\u200B' },
          { name: 'Zbanowany: ', value: `${subject?.user.tag}`, inline: true },
          { name: 'Banujący: ', value: `<@${msg.member!.id}>`, inline: true },
          { name: 'DM dostarczony: ', value: del }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(banMessage);
    });
  },

  permMuteMessage(
    msg: Discord.Message,
    subject: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      const muteMessage = new Discord.MessageEmbed()
        .setColor('#f78707')
        .setTitle('Perm mute')
        .setThumbnail(subject!.user.avatarURL()!)
        .addFields(
          { name: 'Zmutowany: ', value: `<@${subject!.id}>`, inline: true },
          { name: 'Mutujący: ', value: `<@${msg.member!.id}>`, inline: true }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(muteMessage);
    });
  },

  muteMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      for (let i = 3; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      modules.setEndingDate(args[2], 'text', false).then(ending => {
        const muteMessage = new Discord.MessageEmbed()
          .setColor('#f78707')
          .setTitle('Mute')
          .setThumbnail(subject!.user.displayAvatarURL())
          .addFields(
            { name: 'Powód: ', value: reason },
            { name: '\u200B', value: '\u200B' },
            { name: 'Zmutowany: ', value: `<@${subject!.id}>`, inline: true },
            { name: 'Mutujący: ', value: `<@${msg.member!.id}>`, inline: true },
            { name: 'Unmute: ', value: ending }
          )
          .setAuthor(
            'www.dziq.xyz',
            bot.user!.avatarURL()!,
            'http://dziq.xyz/'
          );
        resolve(muteMessage);
      });
    });
  },

  tempBanMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember,
    delivered: boolean
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      const del: string = this.getDMEmojiStatus(delivered);
      for (let i = 3; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      modules.setEndingDate(args[2], 'text', false).then(ending => {
        const tempBanMessage = new Discord.MessageEmbed()
          .setColor('#f70707')
          .setTitle('Tempban')
          .setThumbnail(subject!.user.displayAvatarURL())
          .addFields(
            { name: 'Powód: ', value: reason },
            { name: '\u200B', value: '\u200B' },
            { name: 'Zbanowany: ', value: `<@${subject!.id}>`, inline: true },
            { name: 'Banujący: ', value: `<@${msg.member!.id}>`, inline: true },
            { name: 'Unban: ', value: ending },
            { name: 'DM dostarczony: ', value: del }
          )
          .setAuthor(
            'www.dziq.xyz',
            bot.user!.avatarURL()!,
            'http://dziq.xyz/'
          );
        resolve(tempBanMessage);
      });
    });
  },

  warnMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember,
    warnCount: number,
    muteTime: string
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      for (let i = 2; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      if (muteTime == '0') muteTime = 'Nie dotyczy';
      const warnMessage = new Discord.MessageEmbed()
        .setColor('#f7d307')
        .setTitle('Warn #' + warnCount)
        .setThumbnail(subject.user.avatarURL()!)
        .addFields(
          { name: 'Powód: ', value: reason },
          { name: '\u200B', value: '\u200B' },
          { name: 'Zwarnowany: ', value: `<@${subject!.id}>`, inline: true },
          { name: 'Warnujący: ', value: `<@${msg.member!.id}>`, inline: true },
          { name: 'Unmute: ', value: muteTime }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(warnMessage);
    });
  },

  kickDMMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      for (let i = 2; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      const kickMessage = new Discord.MessageEmbed()
        .setColor('#f74b07')
        .setTitle(`Zostałeś zkickowany z serwera: ${msg.guild!.name}`)
        .setThumbnail(subject.user.avatarURL()!)
        .addFields(
          { name: 'Powód: ', value: reason },
          { name: '\u200B', value: '\u200B' },
          {
            name: 'Zostałeś zkickowany przez: ',
            value: msg.member!.nickname,
            inline: true,
          }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(kickMessage);
    });
  },

  banDMMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      for (let i = 2; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      const banMessage = new Discord.MessageEmbed()
        .setColor('#f70707')
        .setTitle(
          `Zostałeś permanentnie zbanowany z serwera: ${msg.guild!.name}`
        )
        .setThumbnail(subject.user.avatarURL()!)
        .addFields(
          { name: 'Powód: ', value: reason },
          { name: '\u200B', value: '\u200B' },
          {
            name: 'Zostałeś zbanowany przez: ',
            value: msg.member!.nickname,
            inline: true,
          }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(banMessage);
    });
  },

  async tempBanDMMessage(
    msg: Discord.Message,
    args: string[],
    subject: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    const endingDate = await modules.setEndingDate(args[2], 'text', false);
    return new Promise<Discord.MessageEmbed>(resolve => {
      let reason = '';
      for (let i = 3; i < args.length; i++) {
        reason += args[i] + ' ';
      }
      if (reason.length < 1) {
        reason = 'Nie podano powodu.';
      }
      const tempBanMessage = new Discord.MessageEmbed()
        .setColor('#f70707')
        .setTitle(`Zostałeś zbanowany z serwera: ${msg.guild!.name}`)
        .setThumbnail(subject.user.avatarURL()!)
        .addFields(
          { name: 'Powód: ', value: reason },
          { name: '\u200B', value: '\u200B' },
          {
            name: 'Zostałeś zbanowany przez: ',
            value: msg.member!.nickname,
            inline: true,
          },
          { name: 'Zostałeś zbanowany do: ', value: endingDate, inline: true }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(tempBanMessage);
    });
  },

  async joinLogsMessage(
    newMember: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      const joinMessage = new Discord.MessageEmbed()
        .setTitle('Wejście użytkownika')
        .setThumbnail(newMember.user.avatarURL()!)
        .setColor('#3461eb')
        .addFields(
          { name: 'Użytkownik: ', value: `<@${newMember.id}>` },
          { name: 'ID użytkownika: ', value: newMember.user.id }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(joinMessage);
    });
  },

  async leaveLogsMessage(
    oldMember: Discord.GuildMember
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      const leaveMessage = new Discord.MessageEmbed()
        .setTitle('Wyjście użytkownika')
        .setThumbnail(oldMember.user.avatarURL()!)
        .setColor('#3461eb')
        .addFields(
          { name: 'Użytkownik: ', value: oldMember.user.tag },
          { name: 'ID użytkownika: ', value: oldMember.user.id }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(leaveMessage);
    });
  },

  async editLogsMessage(
    oldMessage: Discord.Message,
    newMessage: Discord.Message
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let oldMsg = oldMessage.content;
      let newMsg = newMessage.content;
      if (oldMsg.length > 300) {
        oldMsg = oldMsg!.slice(0, 300);
        oldMsg += ' ...';
      }
      if (newMsg.length > 300) {
        newMsg = newMsg!.slice(0, 300);
        newMsg += ' ...';
      }
      const editedMessage = new Discord.MessageEmbed()
        .setTitle('Wiadomość edytowana')
        .setThumbnail(oldMessage.author.avatarURL()!)
        .setColor('#21ed28')
        .addFields(
          { name: 'Autor:', value: `<@${newMessage.author.id}>`, inline: true },
          {
            name: 'Kanał:',
            value: `<#${newMessage.channel.id}>`,
            inline: true,
          },
          { name: 'Stara treść:', value: oldMsg },
          { name: 'Nowa treść:', value: newMsg }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(editedMessage);
    });
  },

  async deleteLogsMessage(
    deletedMessage: Discord.Message
  ): Promise<Discord.MessageEmbed> {
    return new Promise<Discord.MessageEmbed>(resolve => {
      let message = deletedMessage.content;
      if (message!.length > 600) {
        message = message!.slice(0, 600);
        message += ' ...';
      }
      const deleteMessage = new Discord.MessageEmbed()
        .setTitle('Wiadomość usunięta')
        .setThumbnail(deletedMessage.author.avatarURL()!)
        .setColor('#21ed28')
        .addFields(
          {
            name: 'Autor:',
            value: `<@${deletedMessage.author.id}>`,
            inline: true,
          },
          {
            name: 'Kanał:',
            value: `<#${deletedMessage.channel.id}>`,
            inline: true,
          },
          { name: 'Treść:', value: message }
        )
        .setAuthor('www.dziq.xyz', bot.user!.avatarURL()!, 'http://dziq.xyz/');
      resolve(deleteMessage);
    });
  },
};

export default messages;

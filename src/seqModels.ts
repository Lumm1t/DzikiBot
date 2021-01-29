import Classified from './classified';
import * as Seq from 'sequelize';

const classified = Classified.classified;
const seq = classified.getSeq();

const servers = seq.define(
  'servers',
  {
    ID: {
      type: Seq.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: { len: [0, 60] },
    },
    serwer: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    prefix: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 1] },
    },
    warn: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 5] },
    },
    logi: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    logi2: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    blacklist: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 1000] },
    },
  },
  {
    tableName: 'serwer',
    timestamps: false,
  }
);

const stats = seq.define(
  'stats',
  {
    ID: {
      type: Seq.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: { len: [0, 60] },
    },
    serwer: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    data: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    miejsce_daty: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    czlonkowie: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    miejsce_czlonkow: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    online: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    miejsce_online: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    rekord: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    miejsce_rekordu: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    bany: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    miejsce_banow: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    dzien: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    miejsce_dnia: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
  },
  {
    tableName: 'statystyki',
    timestamps: false,
  }
);

const users = seq.define(
  'users',
  {
    ID: {
      type: Seq.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: { len: [0, 60] },
    },
    serwer: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    uzytkownik: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 60] },
    },
    ilosc_warnow: {
      type: Seq.DataTypes.TEXT,
      validate: { len: [0, 20] },
    },
    data_zakonczenia: {
      type: Seq.DataTypes.BIGINT,
      validate: { len: [0, 60] },
    },
    data_zakonczenia_muta: {
      type: Seq.DataTypes.BIGINT,
      validate: { len: [0, 60] },
    },
    data_zakonczenia_bana: {
      type: Seq.DataTypes.BIGINT,
      validate: { len: [0, 60] },
    },
  },
  {
    tableName: 'uzytkownicy',
    timestamps: false,
  }
);

export default { servers, users, stats };

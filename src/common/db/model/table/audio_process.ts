import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { audio_file, audio_fileId } from "./audio_file";
import type { user_place, user_placeId } from "./user_place";

export interface audio_processAttributes {
  audioProcessKey: number;
  userPlaceKey: number;
  audioKey?: number;
  audioProcessInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  expiredAt?: Date;
}

export type audio_processPk = "audioProcessKey";
export type audio_processId = audio_process[audio_processPk];
export type audio_processOptionalAttributes =
  | "audioProcessKey"
  | "audioKey"
  | "audioProcessInfo"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "expiredAt";
export type audio_processCreationAttributes = Optional<
  audio_processAttributes,
  audio_processOptionalAttributes
>;

export class audio_process
  extends Model<audio_processAttributes, audio_processCreationAttributes>
  implements audio_processAttributes
{
  audioProcessKey!: number;
  userPlaceKey!: number;
  audioKey?: number;
  audioProcessInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  expiredAt?: Date;

  // audio_process belongsTo audio_file via audioKey
  audio_file!: audio_file;
  getAudioKey_audio_file!: Sequelize.BelongsToGetAssociationMixin<audio_file>;
  setAudioKey_audio_file!: Sequelize.BelongsToSetAssociationMixin<
    audio_file,
    audio_fileId
  >;
  createAudioKey_audio_file!: Sequelize.BelongsToCreateAssociationMixin<audio_file>;
  // audio_process belongsTo user_place via userPlaceKey
  user_place!: user_place;
  getUserPlaceKey_user_place!: Sequelize.BelongsToGetAssociationMixin<user_place>;
  setUserPlaceKey_user_place!: Sequelize.BelongsToSetAssociationMixin<
    user_place,
    user_placeId
  >;
  createUserPlaceKey_user_place!: Sequelize.BelongsToCreateAssociationMixin<user_place>;

  static initModel(sequelize: Sequelize.Sequelize): typeof audio_process {
    return audio_process.init(
      {
        audioProcessKey: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        userPlaceKey: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user_place",
            key: "userPlaceKey",
          },
        },
        audioKey: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: "audio_file",
            key: "audioKey",
          },
        },
        audioProcessInfo: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        expiredAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "audio_process",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "audioProcessKey" }],
          },
          {
            name: "FK_user_place_TO_audio_process_1",
            using: "BTREE",
            fields: [{ name: "userPlaceKey" }],
          },
          {
            name: "FK_audio_file_TO_audio_process_1",
            using: "BTREE",
            fields: [{ name: "audioKey" }],
          },
          {
            name: "audio_process_expiredat_index",
            using: "BTREE",
            fields: [{ name: "expiredAt" }],
          },
          {
            name: "audio_process_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

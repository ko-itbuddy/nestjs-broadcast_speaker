import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { audio_process, audio_processId } from "./audio_process";

export interface audio_fileAttributes {
  audioKey: number;
  audioText?: string;
  audioType?: string;
  fileSize?: number;
  fileType?: string;
  fileName?: string;
  fileUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type audio_filePk = "audioKey";
export type audio_fileId = audio_file[audio_filePk];
export type audio_fileOptionalAttributes =
  | "audioKey"
  | "audioText"
  | "audioType"
  | "fileSize"
  | "fileType"
  | "fileName"
  | "fileUrl"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type audio_fileCreationAttributes = Optional<
  audio_fileAttributes,
  audio_fileOptionalAttributes
>;

export class audio_file
  extends Model<audio_fileAttributes, audio_fileCreationAttributes>
  implements audio_fileAttributes
{
  audioKey!: number;
  audioText?: string;
  audioType?: string;
  fileSize?: number;
  fileType?: string;
  fileName?: string;
  fileUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // audio_file hasMany audio_process via audioKey
  audio_processes!: audio_process[];
  getAudio_processes!: Sequelize.HasManyGetAssociationsMixin<audio_process>;
  setAudio_processes!: Sequelize.HasManySetAssociationsMixin<
    audio_process,
    audio_processId
  >;
  addAudio_process!: Sequelize.HasManyAddAssociationMixin<
    audio_process,
    audio_processId
  >;
  addAudio_processes!: Sequelize.HasManyAddAssociationsMixin<
    audio_process,
    audio_processId
  >;
  createAudio_process!: Sequelize.HasManyCreateAssociationMixin<audio_process>;
  removeAudio_process!: Sequelize.HasManyRemoveAssociationMixin<
    audio_process,
    audio_processId
  >;
  removeAudio_processes!: Sequelize.HasManyRemoveAssociationsMixin<
    audio_process,
    audio_processId
  >;
  hasAudio_process!: Sequelize.HasManyHasAssociationMixin<
    audio_process,
    audio_processId
  >;
  hasAudio_processes!: Sequelize.HasManyHasAssociationsMixin<
    audio_process,
    audio_processId
  >;
  countAudio_processes!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof audio_file {
    return audio_file.init(
      {
        audioKey: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        audioText: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        audioType: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        fileSize: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        fileType: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        fileName: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        fileUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "audio_file",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "audioKey" }],
          },
          {
            name: "audio_file_auditext_audiokey_index",
            using: "BTREE",
            fields: [{ name: "audioText" }, { name: "audioKey" }],
          },
          {
            name: "audio_file_audiotype_index",
            using: "BTREE",
            fields: [{ name: "audioType" }],
          },
          {
            name: "audio_file_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

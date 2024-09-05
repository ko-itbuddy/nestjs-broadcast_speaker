import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { audio_process, audio_processId } from "./audio_process";
import type { user, userId } from "./user";

export interface user_placeAttributes {
  userPlaceKey: number;
  userId: string;
  userPlaceName?: string;
  userPlaceSeq?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type user_placePk = "userPlaceKey";
export type user_placeId = user_place[user_placePk];
export type user_placeOptionalAttributes =
  | "userPlaceKey"
  | "userPlaceName"
  | "userPlaceSeq"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type user_placeCreationAttributes = Optional<
  user_placeAttributes,
  user_placeOptionalAttributes
>;

export class user_place
  extends Model<user_placeAttributes, user_placeCreationAttributes>
  implements user_placeAttributes
{
  userPlaceKey!: number;
  userId!: string;
  userPlaceName?: string;
  userPlaceSeq?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // user_place belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // user_place hasMany audio_process via userPlaceKey
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

  static initModel(sequelize: Sequelize.Sequelize): typeof user_place {
    return user_place.init(
      {
        userPlaceKey: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING(30),
          allowNull: false,
          references: {
            model: "user",
            key: "userId",
          },
        },
        userPlaceName: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        userPlaceSeq: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "user_place",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userPlaceKey" }],
          },
          {
            name: "FK_user_TO_user_place_1",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "user_place_userplacename_index",
            using: "BTREE",
            fields: [{ name: "userPlaceName" }],
          },
          {
            name: "user_place_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

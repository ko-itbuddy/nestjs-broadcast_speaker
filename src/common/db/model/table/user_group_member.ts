import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { user_group, user_groupId } from "./user_group";

export interface user_group_memberAttributes {
  userGrpMemkey: number;
  userGrpKey: number;
  userId: string;
  memName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type user_group_memberPk = "userGrpMemkey";
export type user_group_memberId = user_group_member[user_group_memberPk];
export type user_group_memberOptionalAttributes =
  | "userGrpMemkey"
  | "memName"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type user_group_memberCreationAttributes = Optional<
  user_group_memberAttributes,
  user_group_memberOptionalAttributes
>;

export class user_group_member
  extends Model<
    user_group_memberAttributes,
    user_group_memberCreationAttributes
  >
  implements user_group_memberAttributes
{
  userGrpMemkey!: number;
  userGrpKey!: number;
  userId!: string;
  memName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // user_group_member belongsTo user_group via userGrpKey
  user_group!: user_group;
  getUserGrpKey_user_group!: Sequelize.BelongsToGetAssociationMixin<user_group>;
  setUserGrpKey_user_group!: Sequelize.BelongsToSetAssociationMixin<
    user_group,
    user_groupId
  >;
  createUserGrpKey_user_group!: Sequelize.BelongsToCreateAssociationMixin<user_group>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_group_member {
    return user_group_member.init(
      {
        userGrpMemkey: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        userGrpKey: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user_group",
            key: "usergrpkey",
          },
        },
        userId: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        memName: {
          type: DataTypes.CHAR(10),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "user_group_member",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userGrpMemkey" }],
          },
          {
            name: "user_gorup_member_user_group_usergrpkey_fk",
            using: "BTREE",
            fields: [{ name: "userGrpKey" }],
          },
          {
            name: "user_group_member_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

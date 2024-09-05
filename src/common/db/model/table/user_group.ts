import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";
import type {
  user_group_member,
  user_group_memberId,
} from "./user_group_member";

export interface user_groupAttributes {
  userGrpKey: number;
  userId: string;
  userGrpName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type user_groupPk = "userGrpKey";
export type user_groupId = user_group[user_groupPk];
export type user_groupOptionalAttributes =
  | "userGrpKey"
  | "userGrpName"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type user_groupCreationAttributes = Optional<
  user_groupAttributes,
  user_groupOptionalAttributes
>;

export class user_group
  extends Model<user_groupAttributes, user_groupCreationAttributes>
  implements user_groupAttributes
{
  userGrpKey!: number;
  userId!: string;
  userGrpName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // user_group belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // user_group hasMany user_group_member via userGrpKey
  user_group_members!: user_group_member[];
  getUser_group_members!: Sequelize.HasManyGetAssociationsMixin<user_group_member>;
  setUser_group_members!: Sequelize.HasManySetAssociationsMixin<
    user_group_member,
    user_group_memberId
  >;
  addUser_group_member!: Sequelize.HasManyAddAssociationMixin<
    user_group_member,
    user_group_memberId
  >;
  addUser_group_members!: Sequelize.HasManyAddAssociationsMixin<
    user_group_member,
    user_group_memberId
  >;
  createUser_group_member!: Sequelize.HasManyCreateAssociationMixin<user_group_member>;
  removeUser_group_member!: Sequelize.HasManyRemoveAssociationMixin<
    user_group_member,
    user_group_memberId
  >;
  removeUser_group_members!: Sequelize.HasManyRemoveAssociationsMixin<
    user_group_member,
    user_group_memberId
  >;
  hasUser_group_member!: Sequelize.HasManyHasAssociationMixin<
    user_group_member,
    user_group_memberId
  >;
  hasUser_group_members!: Sequelize.HasManyHasAssociationsMixin<
    user_group_member,
    user_group_memberId
  >;
  countUser_group_members!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_group {
    return user_group.init(
      {
        userGrpKey: {
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
        userGrpName: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "user_group",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userGrpKey" }],
          },
          {
            name: "user_group_user_userid_fk",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "user_group_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

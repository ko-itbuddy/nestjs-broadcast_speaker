import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { pay_log, pay_logId } from "./pay_log";
import type { user_group, user_groupId } from "./user_group";
import type { user_place, user_placeId } from "./user_place";

export interface userAttributes {
  userId: string;
  userEmail?: string;
  userName?: string;
  userPasswd?: string;
  userPasswdSalt?: string;
  roles?: string;
  credentialsExpiredAt?: Date;
  lockedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  expiredAt?: Date;
}

export type userPk = "userId";
export type userId = user[userPk];
export type userOptionalAttributes =
  | "userEmail"
  | "userName"
  | "userPasswd"
  | "userPasswdSalt"
  | "roles"
  | "credentialsExpiredAt"
  | "lockedAt"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "expiredAt";
export type userCreationAttributes = Optional<
  userAttributes,
  userOptionalAttributes
>;

export class user
  extends Model<userAttributes, userCreationAttributes>
  implements userAttributes
{
  userId!: string;
  userEmail?: string;
  userName?: string;
  userPasswd?: string;
  userPasswdSalt?: string;
  roles?: string;
  credentialsExpiredAt?: Date;
  lockedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  expiredAt?: Date;

  // user hasMany pay_log via userId
  pay_logs!: pay_log[];
  getPay_logs!: Sequelize.HasManyGetAssociationsMixin<pay_log>;
  setPay_logs!: Sequelize.HasManySetAssociationsMixin<pay_log, pay_logId>;
  addPay_log!: Sequelize.HasManyAddAssociationMixin<pay_log, pay_logId>;
  addPay_logs!: Sequelize.HasManyAddAssociationsMixin<pay_log, pay_logId>;
  createPay_log!: Sequelize.HasManyCreateAssociationMixin<pay_log>;
  removePay_log!: Sequelize.HasManyRemoveAssociationMixin<pay_log, pay_logId>;
  removePay_logs!: Sequelize.HasManyRemoveAssociationsMixin<pay_log, pay_logId>;
  hasPay_log!: Sequelize.HasManyHasAssociationMixin<pay_log, pay_logId>;
  hasPay_logs!: Sequelize.HasManyHasAssociationsMixin<pay_log, pay_logId>;
  countPay_logs!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany user_group via userId
  user_groups!: user_group[];
  getUser_groups!: Sequelize.HasManyGetAssociationsMixin<user_group>;
  setUser_groups!: Sequelize.HasManySetAssociationsMixin<
    user_group,
    user_groupId
  >;
  addUser_group!: Sequelize.HasManyAddAssociationMixin<
    user_group,
    user_groupId
  >;
  addUser_groups!: Sequelize.HasManyAddAssociationsMixin<
    user_group,
    user_groupId
  >;
  createUser_group!: Sequelize.HasManyCreateAssociationMixin<user_group>;
  removeUser_group!: Sequelize.HasManyRemoveAssociationMixin<
    user_group,
    user_groupId
  >;
  removeUser_groups!: Sequelize.HasManyRemoveAssociationsMixin<
    user_group,
    user_groupId
  >;
  hasUser_group!: Sequelize.HasManyHasAssociationMixin<
    user_group,
    user_groupId
  >;
  hasUser_groups!: Sequelize.HasManyHasAssociationsMixin<
    user_group,
    user_groupId
  >;
  countUser_groups!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany user_place via userId
  user_places!: user_place[];
  getUser_places!: Sequelize.HasManyGetAssociationsMixin<user_place>;
  setUser_places!: Sequelize.HasManySetAssociationsMixin<
    user_place,
    user_placeId
  >;
  addUser_place!: Sequelize.HasManyAddAssociationMixin<
    user_place,
    user_placeId
  >;
  addUser_places!: Sequelize.HasManyAddAssociationsMixin<
    user_place,
    user_placeId
  >;
  createUser_place!: Sequelize.HasManyCreateAssociationMixin<user_place>;
  removeUser_place!: Sequelize.HasManyRemoveAssociationMixin<
    user_place,
    user_placeId
  >;
  removeUser_places!: Sequelize.HasManyRemoveAssociationsMixin<
    user_place,
    user_placeId
  >;
  hasUser_place!: Sequelize.HasManyHasAssociationMixin<
    user_place,
    user_placeId
  >;
  hasUser_places!: Sequelize.HasManyHasAssociationsMixin<
    user_place,
    user_placeId
  >;
  countUser_places!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        userId: {
          type: DataTypes.STRING(30),
          allowNull: false,
          primaryKey: true,
        },
        userEmail: {
          type: DataTypes.STRING(254),
          allowNull: true,
        },
        userName: {
          type: DataTypes.CHAR(10),
          allowNull: true,
        },
        userPasswd: {
          type: DataTypes.CHAR(64),
          allowNull: true,
        },
        userPasswdSalt: {
          type: DataTypes.CHAR(10),
          allowNull: true,
        },
        roles: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        credentialsExpiredAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        lockedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        expiredAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "user_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

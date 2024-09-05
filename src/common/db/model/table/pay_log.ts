import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface pay_logAttributes {
  payLogKey: number;
  userId: string;
  payInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  canceledAt?: Date;
}

export type pay_logPk = "payLogKey";
export type pay_logId = pay_log[pay_logPk];
export type pay_logOptionalAttributes =
  | "payLogKey"
  | "payInfo"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "canceledAt";
export type pay_logCreationAttributes = Optional<
  pay_logAttributes,
  pay_logOptionalAttributes
>;

export class pay_log
  extends Model<pay_logAttributes, pay_logCreationAttributes>
  implements pay_logAttributes
{
  payLogKey!: number;
  userId!: string;
  payInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  canceledAt?: Date;

  // pay_log belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof pay_log {
    return pay_log.init(
      {
        payLogKey: {
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
        payInfo: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        canceledAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "pay_log",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "payLogKey" }],
          },
          {
            name: "FK_user_TO_pay_log_1",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "pay_log_deletedat_index",
            using: "BTREE",
            fields: [{ name: "deletedAt" }],
          },
        ],
      }
    );
  }
}

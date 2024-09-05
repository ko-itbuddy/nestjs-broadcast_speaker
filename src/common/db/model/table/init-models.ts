import type {
  audio_fileAttributes,
  audio_fileCreationAttributes,
} from "./audio_file";
import type {
  audio_processAttributes,
  audio_processCreationAttributes,
} from "./audio_process";
import type { pay_logAttributes, pay_logCreationAttributes } from "./pay_log";
import type { userAttributes, userCreationAttributes } from "./user";
import type {
  user_groupAttributes,
  user_groupCreationAttributes,
} from "./user_group";
import type {
  user_group_memberAttributes,
  user_group_memberCreationAttributes,
} from "./user_group_member";
import type {
  user_placeAttributes,
  user_placeCreationAttributes,
} from "./user_place";

import type { Sequelize } from "sequelize";
import { audio_file as _audio_file } from "./audio_file";
import { audio_process as _audio_process } from "./audio_process";
import { pay_log as _pay_log } from "./pay_log";
import { user as _user } from "./user";
import { user_group as _user_group } from "./user_group";
import { user_group_member as _user_group_member } from "./user_group_member";
import { user_place as _user_place } from "./user_place";

export {
  _audio_file as audio_file,
  _audio_process as audio_process,
  _pay_log as pay_log,
  _user as user,
  _user_group as user_group,
  _user_group_member as user_group_member,
  _user_place as user_place,
};

export type {
  audio_fileAttributes,
  audio_fileCreationAttributes,
  audio_processAttributes,
  audio_processCreationAttributes,
  pay_logAttributes,
  pay_logCreationAttributes,
  userAttributes,
  userCreationAttributes,
  user_groupAttributes,
  user_groupCreationAttributes,
  user_group_memberAttributes,
  user_group_memberCreationAttributes,
  user_placeAttributes,
  user_placeCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const audio_file = _audio_file.initModel(sequelize);
  const audio_process = _audio_process.initModel(sequelize);
  const pay_log = _pay_log.initModel(sequelize);
  const user = _user.initModel(sequelize);
  const user_group = _user_group.initModel(sequelize);
  const user_group_member = _user_group_member.initModel(sequelize);
  const user_place = _user_place.initModel(sequelize);

  audio_process.belongsTo(audio_file, {
    as: "audio_file",
    foreignKey: "audioKey",
  });
  audio_file.hasMany(audio_process, {
    as: "audio_processes",
    foreignKey: "audioKey",
  });
  pay_log.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(pay_log, { as: "pay_logs", foreignKey: "userId" });
  user_group.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(user_group, { as: "user_groups", foreignKey: "userId" });
  user_place.belongsTo(user, { as: "user", foreignKey: "userId" });
  user.hasMany(user_place, { as: "user_places", foreignKey: "userId" });
  user_group_member.belongsTo(user_group, {
    as: "user_group",
    foreignKey: "userGrpKey",
  });
  user_group.hasMany(user_group_member, {
    as: "user_group_members",
    foreignKey: "userGrpKey",
  });
  audio_process.belongsTo(user_place, {
    as: "user_place",
    foreignKey: "userPlaceKey",
  });
  user_place.hasMany(audio_process, {
    as: "audio_processes",
    foreignKey: "userPlaceKey",
  });

  return {
    audio_file: audio_file,
    audio_process: audio_process,
    pay_log: pay_log,
    user: user,
    user_group: user_group,
    user_group_member: user_group_member,
    user_place: user_place,
  };
}

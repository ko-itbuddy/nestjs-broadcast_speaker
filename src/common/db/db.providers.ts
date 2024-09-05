// import * as config from "config";

import * as config from "config";

import {
  initModels,
  user_group,
  user_group_member,
} from "./model/table/init-models";

import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { Sequelize } from "sequelize-typescript";
import { audio_file } from "@src/common/db/model/table/audio_file";
import { audio_process } from "@src/common/db/model/table/audio_process";
import { pay_log } from "@src/common/db/model/table/pay_log";
import { user } from "@src/common/db/model/table/user";
import { user_place } from "@src/common/db/model/table/user_place";

export const DBProviders = [
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.CON_POOL,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: config.get("mainDB.dialect"),
        host: config.get("mainDB.host"),
        username: config.get("mainDB.username"),
        password: config.get("mainDB.password"),
        database: config.get("mainDB.database"),
        pool: {
          max: 100,
          min: 10,
          idle: 10,
          acquire: 1000,
        },
      });
      initModels(sequelize);
      await sequelize.sync();
      return sequelize;
    },
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.AUDIO_FILE_REPOSITORY,
    useValue: audio_file,
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.AUDIO_PROCESS_REPOSITORY,
    useValue: audio_process,
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.PAY_LOG_REPOSITORY,
    useValue: pay_log,
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_PLACE_REPOSITORY,
    useValue: user_place,
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_REPOSITORY,
    useValue: user,
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_GROUP_REPOSITORY,
    useValue: user_group,
  },
  {
    provide: CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_GROUP_MEMBER_REPOSITORY,
    useValue: user_group_member,
  },
];

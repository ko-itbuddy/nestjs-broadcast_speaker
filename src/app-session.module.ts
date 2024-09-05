import * as SessionFileStore from "session-file-store";
// import * as ConnectRedis from "connect-redis";
import * as config from "config";
import * as session from "express-session";

import { NestSessionOptions, SessionModule } from "nestjs-session";

// import { Redis } from "./Redis.module";
// import { RedisService } from "nestjs-redis";

// const RedisStore = ConnectRedis(session);

const FileStore = SessionFileStore(session);
const fileStoreOptions: SessionFileStore.Options = {};

export const InitSessionModule = SessionModule.forRootAsync({
  useFactory: (): NestSessionOptions => {
    return {
      session: {
        store: new FileStore(fileStoreOptions),
        secret: config.get("express.session.secret"),
        resave: false,
        saveUninitialized: false,
      },
    };
  },
});

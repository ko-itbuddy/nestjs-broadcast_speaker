import "winston-daily-rotate-file";

import * as config from "config";

import { WinstonModule, utilities } from "nest-winston";
import { format, transports } from "winston";

// import fs from 'fs';

let logDir = "";
if (process.env.NODE_APP_INSTANCE != undefined) {
  logDir = config.get("logger.path") + "/" + process.env.NODE_APP_INSTANCE;
} else {
  logDir = config.get("logger.path");
}

const myFormat = format.combine(
  // format.timestamp(),
  format.errors({ stack: true }),
  format.timestamp(),
  utilities.format.nestLike("SEOYEON2", {
    prettyPrint: true,
  })
);

const dailyRotateFileTransport = new transports.DailyRotateFile({
  level: config.get("logger.logLevel"),
  filename: `${logDir}/speaker-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: myFormat,
});

export const InitLoggerModule = WinstonModule.forRoot({
  transports: [
    new transports.Console({
      level: config.get("logger.logLevel"),
      format: myFormat,
    }),
    dailyRotateFileTransport,
  ],
});

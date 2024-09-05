import * as AWS from "aws-sdk";
import * as config from "config";

import { DynamicModule } from "@nestjs/common";
import { MulterExtendedModule } from "nestjs-multer-extended";

AWS.config.update({
  accessKeyId: config.get("aws.accessKeyId"),
  secretAccessKey: config.get("aws.secretAccessKey"),
  region: "ap-northeast-2",
});

export const InitFileUploadModule: DynamicModule =
  MulterExtendedModule.register({
    awsConfig: {
      accessKeyId: config.get("aws.accessKeyId"),
      secretAccessKey: config.get("aws.secretAccessKey"),
      region: config.get("aws.s3.region"),
    },
    bucket: config.get("aws.s3.bucket"),
    basePath: config.get("aws.s3.basePath"),
    fileSize: config.get("aws.s3.fileSize"),
  });

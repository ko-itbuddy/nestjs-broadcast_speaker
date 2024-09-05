import * as config from "config";

import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { Provider } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { PollyClient, DeleteLexiconCommand } from "@aws-sdk/client-polly";

// Constants
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const awsRegion = "ap-south-1";
export const awsBucket = process.env.AWS_BUCKET;

export const AWSProviders: Array<Provider> = [
  {
    provide: CONST_PROVIDER_NAME.AWS_SDK.S3_CLIENT,
    useFactory: async () =>
      new S3Client({
        credentials: {
          accessKeyId: config.get("aws.accessKeyId"),
          secretAccessKey: config.get("aws.secretAccessKey"),
        },
        region: config.get("aws.s3.region"),
        // bucketEndpoint: config.get("aws.s3.bucket"),
      }),
  },
  {
    provide: CONST_PROVIDER_NAME.AWS_SDK.POLLY_CLIENT,
    useFactory: async () =>
      new PollyClient({
        region: config.get("aws.s3.region"),
        credentials: {
          accessKeyId: config.get("aws.accessKeyId"),
          secretAccessKey: config.get("aws.secretAccessKey"),
        },
      }),
  },
];
// awsConfig: {
//   accessKeyId: config.get("aws.accessKeyId"),
//   secretAccessKey: config.get("aws.secretAccessKey"),
//   region: config.get("aws.s3.region"),
// },
// bucket: config.get("aws.s3.bucket"),
// basePath: config.get("aws.s3.basePath"),
// fileSize: config.get("aws.s3.fileSize"),

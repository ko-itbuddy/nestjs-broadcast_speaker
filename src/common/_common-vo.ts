import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsEmail,
} from "class-validator";

import { CONST_COMMON } from "@src/common/const/const-common";
import { userAttributes } from "./db/model/table/user";
import { CONST_DB } from "./const/const-db";

// SERVER INFO
export interface sessionAttributes {
  userId: string;
}

// COMMON ATTRIBUTES
export interface CPVOptionsAttributes {
  speaker?: string;
  volume?: number;
  speed?: number;
  pitch?: number;
  emotion?: number;
  text: string;
  format?: string;
}

export interface AwsPollyOptionAttributes {
  OutputFormat: string;
  OutputS3BucketName: string;
  OutputS3KeyPrefix: string;
  Text: string;
  TextType: string;
  VoiceId: string;
  SampleRate: string;
}

//MAIN
export class ReqPostTransmitVo {
  @IsString()
  id: string;

  @IsString()
  place: string;

  @IsIn([
    CONST_COMMON.MAIN_POST_TRANSMIT.TYPE.NAME,
    CONST_COMMON.MAIN_POST_TRANSMIT.TYPE.NUMBER,
  ])
  type: string;

  @IsOptional()
  @IsNumberString()
  number?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class ReqPostRequestVo {
  @IsString()
  id: string;

  @IsString()
  place: string;
}

export class ReqPostGetGrpMemVo {
  @IsString()
  id: string;
}

// LOGIN
export class ReqPostLoginJsonVo {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  pw: string;
}

export class ReqPostUserVo implements userAttributes {
  userId: string;

  @IsEmail()
  @IsOptional()
  userEmail?: string;

  userName?: string;

  userPasswd?: string;

  userPasswdSalt?: string;

  @IsIn([
    CONST_DB.USER.ROLE.ADMIN,
    CONST_DB.USER.ROLE.SUPER_ADMIN,
    CONST_DB.USER.ROLE.USER,
  ])
  roles?: string;

  @IsOptional()
  @IsDate()
  expiredAt?: Date;

  @IsOptional()
  @IsDate()
  credentialsExpiredAt?: Date;

  @IsOptional()
  @IsDate()
  lockedAt?: Date;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

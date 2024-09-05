import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import * as config from "config";
import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { Sequelize } from "sequelize-typescript";
import { audio_file } from "@src/common/db/model/table/audio_file";
import { audio_process } from "@src/common/db/model/table/audio_process";
import { pay_log } from "@src/common/db/model/table/pay_log";
import { user_place } from "@src/common/db/model/table/user_place";
import { user, userAttributes } from "@src/common/db/model/table/user";
import { ResponseFactory } from "@src/common/response-factory.provider";
import { ReqPostLoginJsonVo } from "@src/common/_common-vo";
import { CONST_RESULT_CODE_MSG } from "@src/common/const/const-result-code-msg";

@Injectable()
export class LoginService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(CONST_PROVIDER_NAME.AWS_SDK.S3_CLIENT) private s3Client: S3Client,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.CON_POOL)
    private readonly sequelize: Sequelize,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.AUDIO_FILE_REPOSITORY)
    private readonly audioFileRepository: typeof audio_file,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.AUDIO_PROCESS_REPOSITORY)
    private readonly audioProcessRepository: typeof audio_process,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.PAY_LOG_REPOSITORY)
    private readonly payLogRepository: typeof pay_log,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_PLACE_REPOSITORY)
    private readonly userPlaceRepository: typeof user_place,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_REPOSITORY)
    private readonly userRepository: typeof user,
    @Inject(CONST_PROVIDER_NAME.RESPONSE_FACTORY)
    private readonly responseFactory: ResponseFactory
  ) {}

  public async postLoginJsonResult(reqPostLoginJsonVo: ReqPostLoginJsonVo) {
    try {
      const loginUser: userAttributes = await this.userRepository.findOne({
        where: {
          userId: reqPostLoginJsonVo.id,
          userPasswd: reqPostLoginJsonVo.pw,
        },
        attributes: { exclude: ["userPasswd", "userPasswdSalt"] },
      });
      if (loginUser) {
        return loginUser;
      } else {
        throw new BadRequestException(
          CONST_RESULT_CODE_MSG.ERROR.USER.LOGIN_FAIL,
          CONST_RESULT_CODE_MSG.ERROR.USER.LOGIN_FAIL.MSG
        );
      }
    } catch (err) {
      throw err;
    }
  }
  public async postUserResult(reqPostLoginJsonVo: ReqPostLoginJsonVo) {
    try {
      const loginUser: userAttributes = await this.userRepository.findOne({
        where: {
          userId: reqPostLoginJsonVo.id,
          userPasswd: reqPostLoginJsonVo.pw,
        },
        attributes: { exclude: ["userPasswd", "userPasswdSalt"] },
      });
      if (loginUser) {
        return loginUser;
      } else {
        throw new BadRequestException(
          CONST_RESULT_CODE_MSG.ERROR.USER.LOGIN_FAIL.CODE,
          CONST_RESULT_CODE_MSG.ERROR.USER.LOGIN_FAIL.MSG
        );
      }
    } catch (err) {
      throw err;
    }
  }
}

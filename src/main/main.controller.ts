import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";

import { Response, Request } from "express";
import { LoggingInterceptor } from "@src/common/logging.interceptor";
import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { audio_file } from "@src/common/db/model/table/audio_file";
import { audio_process } from "@src/common/db/model/table/audio_process";
import { pay_log } from "@src/common/db/model/table/pay_log";
import { user_place } from "@src/common/db/model/table/user_place";
import { user, userAttributes } from "@src/common/db/model/table/user";
import * as uuid from "uuid";
import { Sequelize } from "sequelize-typescript";
import { CONST_DB } from "@src/common/const/const-db";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { ResponseFactory } from "@src/common/response-factory.provider";
import { CONST_RESULT_CODE_MSG } from "@src/common/const/const-result-code-msg";
import { MainService } from "./main.service";
import { ApiTags } from "@nestjs/swagger";
import {
  ReqPostGetGrpMemVo,
  ReqPostRequestVo,
  ReqPostTransmitVo,
} from "@src/common/_common-vo";
import { AllExceptionsFilter } from "@src/app-exception.filter";

@UseFilters(AllExceptionsFilter)
@UseInterceptors(LoggingInterceptor)
@ApiTags("MAIN")
@Controller("/main")
export class MainController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
    @Inject(MainService)
    private readonly mainService: MainService,
    @Inject(CONST_PROVIDER_NAME.RESPONSE_FACTORY)
    private readonly responseFactory: ResponseFactory
  ) {}

  @Get("/users")
  public async getUsers(@Req() req: Request, @Res() res: Response) {
    const result = await this.userRepository.findAll({
      attributes: { exclude: ["userPasswd", "userPasswdSalt"] },
      include: [{ model: user_place, as: "user_places" }],
    });
    res.send(result);
  }

  @Post("/user")
  public async postUser(@Req() req: Request, @Res() res: Response) {
    try {
      let reqUser: userAttributes = req.body.user;
      reqUser = {
        ...reqUser,
        userPasswdSalt: uuid.v4().substring(0, 10),
        roles: CONST_DB.USER.ROLE.ADMIN.V,
      };
      const [model, created] = await this.userRepository.findOrCreate({
        where: { userId: reqUser.userId, userEmail: reqUser.userEmail },
        attributes: { exclude: ["userPasswd", "userPasswdSalt"] },
      });
      if (created) {
        // 성공
        res
          .status(200)
          .send(
            this.responseFactory.getRes(model, CONST_RESULT_CODE_MSG.SUCCESS)
          );
      } else {
        // 실패
        res
          .status(200)
          .send(
            this.responseFactory.getRes(
              null,
              CONST_RESULT_CODE_MSG.ERROR.USER.SIGNUP_FAIL
            )
          );
      }
    } catch (e) {
      res.status(400).send();
      this.logger.error(e);
    }
  }

  @Post("/transmit")
  public async postTransmit(
    @Body() reqBody: ReqPostTransmitVo,
    @Res() res: Response
  ) {
    try {
      res
        .status(200)
        .send(
          this.responseFactory.getRes(
            await this.mainService.postTransmitResultVo(reqBody),
            CONST_RESULT_CODE_MSG.SUCCESS
          )
        );
    } catch (err) {
      this.logger.error(err);
      res
        .status(400)
        .send(
          this.responseFactory.getError(
            err,
            CONST_RESULT_CODE_MSG.ERROR.DEFAULT
          )
        );
    }
  }

  @Post("/request")
  public async postRequest(
    @Body() reqBody: ReqPostRequestVo,
    @Res() res: Response
  ) {
    try {
      res
        .status(200)
        .send(
          this.responseFactory.getRes(
            await this.mainService.postRequestResultVo(reqBody),
            CONST_RESULT_CODE_MSG.SUCCESS
          )
        );
    } catch (err) {
      this.logger.error(err.message, err.stack);
      this.logger.error(err.stack);
      res
        .status(400)
        .send(
          this.responseFactory.getError(
            err,
            CONST_RESULT_CODE_MSG.ERROR.DEFAULT
          )
        );
    }
  }

  @Post("/getgrpmem")
  public async postGetGrpMem(
    @Body() reqBody: ReqPostGetGrpMemVo,
    @Res() res: Response
  ) {
    try {
      res
        .status(200)
        .send(
          this.responseFactory.getRes(
            await this.mainService.postGetGrpMemResultVo(reqBody),
            CONST_RESULT_CODE_MSG.SUCCESS
          )
        );
    } catch (err) {
      this.logger.error(err);
      this.logger.error(err.stack);
      res
        .status(400)
        .send(
          this.responseFactory.getError(
            err,
            CONST_RESULT_CODE_MSG.ERROR.DEFAULT
          )
        );
    }
  }

  @Get("/aes.key")
  public async aesKey(@Headers() headers: Headers, @Res() res: Response) {
    console.log(headers);
    res
      .status(200)
      .send(
        this.responseFactory.getRes(headers, CONST_RESULT_CODE_MSG.SUCCESS)
      );
  }
  @Get("/tts")
  public async tts(@Res() res: Response) {
    try {
      const reqBody: ReqPostTransmitVo = {
        id: "admin",
        place: "전체",
        type: "number",
        number: "8882",
        name: "이광헌",
      };

      res
        .status(200)
        .send(
          this.responseFactory.getRes(
            await this.mainService.postTransmitResultVo(reqBody),
            CONST_RESULT_CODE_MSG.SUCCESS
          )
        );
    } catch (err) {
      this.logger.error(err);
      res
        .status(400)
        .send(
          this.responseFactory.getError(
            err,
            CONST_RESULT_CODE_MSG.ERROR.DEFAULT
          )
        );
    }
  }
}

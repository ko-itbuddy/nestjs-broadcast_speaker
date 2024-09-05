import {
  All,
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";

import { Response, Request } from "express";
import { LoggingInterceptor } from "@src/common/logging.interceptor";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { user, userAttributes } from "@src/common/db/model/table/user";
import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { Sequelize } from "sequelize-typescript";
import { ResponseFactory } from "@src/common/response-factory.provider";
import { audio_file } from "@src/common/db/model/table/audio_file";
import { pay_log } from "@src/common/db/model/table/pay_log";
import { user_place } from "@src/common/db/model/table/user_place";
import { CONST_RESULT_CODE_MSG } from "@src/common/const/const-result-code-msg";
import { ReqPostLoginJsonVo } from "@src/common/_common-vo";
import { LoginService } from "@src/login/login.service";
import { audio_process } from "@src/common/db/model/table/audio_process";

@UseInterceptors(LoggingInterceptor)
@Controller("/login")
export class LoginController {
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
    @Inject(LoginService)
    private readonly loginService: LoginService,
    @Inject(CONST_PROVIDER_NAME.RESPONSE_FACTORY)
    private readonly responseFactory: ResponseFactory
  ) {}
  @Post("/user")
  public async postUser(@Body() reqBody, @Res() res: Response) {
    try {
      res
        .status(200)
        .send(
          this.responseFactory.getRes(
            this.loginService.postLoginJsonResult(reqBody),
            CONST_RESULT_CODE_MSG.SUCCESS
          )
        );
    } catch (err) {
      this.logger.error(err);
      res
        .status(400)
        .send(
          this.responseFactory.getRes(
            err,
            CONST_RESULT_CODE_MSG.ERROR.USER.LOGIN_FAIL
          )
        );
    }
  }

  @All("/login")
  public async allLogin(@Req() req: Request, @Res() res: Response) {
    this.logger.info("Welcome login");
    res.send("login");
  }

  @Post("/loginjson")
  public async postLoginJson(
    @Body() reqBody: ReqPostLoginJsonVo,
    @Res() res: Response
  ) {
    try {
      res
        .status(200)
        .send(
          this.responseFactory.getRes(
            this.loginService.postLoginJsonResult(reqBody),
            CONST_RESULT_CODE_MSG.SUCCESS
          )
        );
    } catch (err) {
      this.logger.error(err.stack);
      res
        .status(400)
        .send(
          this.responseFactory.getRes(
            err,
            CONST_RESULT_CODE_MSG.ERROR.USER.LOGIN_FAIL
          )
        );
    }
  }

  // @All("/logout.action")
  // public allLogout(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Session() session: {}
  // ) {
  //   return "redirect:./";
  // }
}

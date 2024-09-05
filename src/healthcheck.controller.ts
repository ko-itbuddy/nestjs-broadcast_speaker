import { All, Controller, Inject, Res, UseInterceptors } from "@nestjs/common";

import { Response } from "express";
import { LoggingInterceptor } from "@src/common/logging.interceptor";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@UseInterceptors(LoggingInterceptor)
@Controller()
export class HealthCheckController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @All("/")
  public async getUsers(@Res() res: Response) {
    res.status(200).send();
  }
}

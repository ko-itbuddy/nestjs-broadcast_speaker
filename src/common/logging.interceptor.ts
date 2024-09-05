import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import * as config from "config";

import { Request } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { level, Logger } from "winston";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { url, method, params, query, body } = req;
    this.logger.log({
      level: config.get("logger.logLevel"),
      message: `Request {${url}, ${method}} - body : ${JSON.stringify(body)}`,
    });

    const now = Date.now();
    return next.handle().pipe(
      // eslint-disable-next-line prettier/prettier
      map(data => {
        this.logger.log({
          level: config.get("logger.logLevel"),
          message: `Response {${url}, ${method}, ${statusCode}} ${
            Date.now() - now
          }ms - ${data}`,
        });
        // if (process.env.NODE_ENV == "development") console.log(data);
      })
    );
  }
}

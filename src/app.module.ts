import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import {
  Global,
  Module,
  OnApplicationShutdown,
  ValidationPipe,
} from "@nestjs/common";

import { AllExceptionsFilter } from "./app-exception.filter";
import { CommonProviderModule } from "@src/common/_common-provider.module";
import { HealthCheckController } from "@src/healthcheck.controller";
import { InitFileUploadModule } from "@src/app-file-upload.module";
import { InitLoggerModule } from "@src/app-logger.module";
import { InitSessionModule } from "@src/app-session.module";
import { LoginModule } from "@src/login/login.module";
import { MainModule } from "@src/main/main.module";
import { ConfigModule } from "@nestjs/config";

class Pm2Shutdown implements OnApplicationShutdown {
  onApplicationShutdown() {
    process.on("SIGINT", () => {
      process.exit(1);
    });
  }
}

@Global()
@Module({
  controllers: [HealthCheckController],
  imports: [
    //COMMONS
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonProviderModule,
    //
    InitSessionModule,
    InitFileUploadModule,
    InitLoggerModule,
    //Business Modules
    LoginModule,
    MainModule,
  ],
  providers: [
    Pm2Shutdown, // pm2 연동 모듈
    {
      provide: APP_PIPE, // 벨리데이션 PIPE
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

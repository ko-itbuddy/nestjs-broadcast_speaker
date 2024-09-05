import * as config from "config";
import * as fs from "fs";

import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";

import { AllExceptionsFilter } from "./app-exception.filter";
import { AppModule } from "./app.module";
import { join } from "path";

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync("./secrets/key.pem", "utf-8"),
  //   cert: fs.readFileSync("./secrets/server.crt", "utf-8"),
  // };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // app.useGlobalGuards(new RolesGuard());
  app.useStaticAssets({
    root: join(__dirname, "..", "/resources/static"),
    prefix: "/",
  });

  // app.setViewEngine('ejs');

  // CORS 처리 session 사용도 허용
  app.enableCors({
    credentials: true,
    origin: true,
  });

  await app.listen(config.get("express.port"));

  if (process.env.NODE_APP_INSTANCE != undefined) {
    console.log("server in on " + config.get("express.port"));
    console.log("log path : " + config.get("logger.path"));
  } else {
    console.log(
      process.env.NODE_APP_INSTANCE +
        ": server in on " +
        config.get("express.port")
    );
    console.log(
      process.env.NODE_APP_INSTANCE +
        ": log path : " +
        config.get("logger.path")
    );
  }

  if (process.env.NODE_ENV == "production") {
    console.log("on production mod it will not logging on console");
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // shutdown시 시그널 처리 PM2 연동
  app.enableShutdownHooks();
}
bootstrap();

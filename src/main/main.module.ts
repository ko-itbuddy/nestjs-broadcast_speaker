import { MainController } from "@src/main/main.controller";
import { MainService } from "@src/main/main.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [MainController],
  //포함하는 서비스들의 모든 의존 객체를 provider에 넣어 주어야함 에러메시지에서 필요한 의존성 객체 확인 가능
  //또는 Global 모듈로 설정해놓으면 됨 Global 로 설정한 모듈에서 에러가 없어야 DI가 정상적으로 작동
  providers: [MainService],
})
export class MainModule {}

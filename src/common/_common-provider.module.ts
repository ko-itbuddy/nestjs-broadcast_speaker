import { Global, Module } from "@nestjs/common";

import { AWSProviders } from "@src/common/aws.providers";
import { DBProviders } from "@src/common/db/db.providers";
import { ResponseFactoryProvider } from "@src/common/response-factory.provider";

@Global()
@Module({
  providers: [...DBProviders, ...AWSProviders, ResponseFactoryProvider],
  exports: [...DBProviders, ...AWSProviders, ResponseFactoryProvider],
})
export class CommonProviderModule {}

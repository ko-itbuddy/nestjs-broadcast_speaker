import { HttpException, Provider } from "@nestjs/common";

import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { CONST_RESULT_CODE_MSG } from "@src/common/const/const-result-code-msg";
import { isEmpty } from "class-validator";

export class ResponseFactory {
  public getRes(
    obj,
    resultCodeMsg: { CODE: string; MSG: string }
  ): HttpResponse {
    try {
      return {
        statusCode: !isEmpty(resultCodeMsg.CODE)
          ? resultCodeMsg.CODE
          : CONST_RESULT_CODE_MSG.SUCCESS.CODE,
        message: !isEmpty(resultCodeMsg.MSG)
          ? resultCodeMsg.MSG
          : CONST_RESULT_CODE_MSG.SUCCESS.MSG,
        json: obj,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  public getError(
    err: Error,
    resultCodeMsg: { CODE: string; MSG: string }
  ): HttpResponse {
    try {
      if (err instanceof HttpException) {
        return {
          statusCode: `${err.getStatus()}`,
          message: err.message,
          error: err.constructor.name,
        };
      } else {
        return {
          statusCode: !isEmpty(resultCodeMsg.CODE)
            ? resultCodeMsg.CODE
            : CONST_RESULT_CODE_MSG.ERROR.DEFAULT.CODE,
          message: !isEmpty(resultCodeMsg.MSG)
            ? resultCodeMsg.MSG
            : CONST_RESULT_CODE_MSG.ERROR.DEFAULT.CODE,
          error: err.name,
        };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const ResponseFactoryProvider: Provider = {
  provide: CONST_PROVIDER_NAME.RESPONSE_FACTORY,
  useFactory: async () => new ResponseFactory(),
};

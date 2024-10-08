export const CONST_PROVIDER_NAME = {
  DB: {
    MAIN: {
      CON_POOL: "DB/MAIN/CON_POOL",
      MODEL: {
        AUDIO_FILE_REPOSITORY: "DB/MAIN/MODEL/AUDIO_FILE_REPOSITORY",
        AUDIO_PROCESS_REPOSITORY: "DB/MAIN/MODEL/AUDIO_PROCESS_REPOSITORY",
        PAY_LOG_REPOSITORY: "DB/MAIN/MODEL/PAY_LOG_REPOSITORY",
        USER_REPOSITORY: "DB/MAIN/MODEL/USER_REPOSITORY",
        USER_PLACE_REPOSITORY: "DB/MAIN/MODEL/USER_PLACE_REPOSITORY",
        USER_GROUP_REPOSITORY: "DB/MAIN/MODEL/USER_GROUP_REPOSITORY",
        USER_GROUP_MEMBER_REPOSITORY:
          "DB/MAIN/MODEL/USER_GROUP_MEMBER_REPOSITORY",
      },
    },
  },
  AWS_SDK: {
    S3_CLIENT: "AWS_SDK/S3_CLIENT",
    POLLY_CLIENT: "AWS_SDK/POLLY_CLIENT",
  },
  RESPONSE_FACTORY: "RESPONSE_FACTORY",
};

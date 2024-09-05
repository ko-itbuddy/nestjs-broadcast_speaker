import { AwsPollyOptionAttributes } from "./../common/_common-vo";
import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
} from "@aws-sdk/client-polly";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import * as config from "config";
import axios from "axios";
import { CONST_PROVIDER_NAME } from "@src/common/const/const-provider-name";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import * as uuid from "uuid";
import * as qs from "qs";
import { Sequelize } from "sequelize-typescript";
import { audio_file } from "@src/common/db/model/table/audio_file";
import { audio_process } from "@src/common/db/model/table/audio_process";
import { pay_log } from "@src/common/db/model/table/pay_log";
import { user_place } from "@src/common/db/model/table/user_place";
import { user } from "@src/common/db/model/table/user";
import { ResponseFactory } from "@src/common/response-factory.provider";
import { CONST_COMMON } from "@src/common/const/const-common";
import * as moment from "moment";
import {
  CPVOptionsAttributes,
  ReqPostGetGrpMemVo,
  ReqPostRequestVo,
  ReqPostTransmitVo,
} from "@src/common/_common-vo";
import { CONST_RESULT_CODE_MSG } from "@src/common/const/const-result-code-msg";
import { Op } from "sequelize";
import { user_group } from "@src/common/db/model/table/user_group";
import { user_group_member } from "@src/common/db/model/table/user_group_member";

@Injectable()
export class MainService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(CONST_PROVIDER_NAME.AWS_SDK.S3_CLIENT) private s3Client: S3Client,
    @Inject(CONST_PROVIDER_NAME.AWS_SDK.POLLY_CLIENT)
    private pollyClient: PollyClient,
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
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_GROUP_REPOSITORY)
    private readonly userGroupRepository: typeof user_group,
    @Inject(CONST_PROVIDER_NAME.DB.MAIN.MODEL.USER_GROUP_MEMBER_REPOSITORY)
    private readonly userGroupMemberRepository: typeof user_group_member,
    @Inject(CONST_PROVIDER_NAME.RESPONSE_FACTORY)
    private readonly responseFactory: ResponseFactory
  ) { }

  public async postTransmitResultVo(reqPostTransmitVo: ReqPostTransmitVo) {
    const transaction = await this.sequelize.transaction();
    try {
      const fileExt = "mp3";

      const fileName = `${uuid.v4()}.${fileExt}`;

      const params: AwsPollyOptionAttributes = {
        OutputFormat: `${fileExt}`,
        OutputS3BucketName: `${config.get("aws.s3.bucket")}`,
        OutputS3KeyPrefix: `${config.get("aws.s3.basePath")}`,
        Text: "",
        TextType: "ssml",
        VoiceId: "Seoyeon",
        SampleRate: "22050",
      };

      switch (reqPostTransmitVo.type) {
        case CONST_COMMON.MAIN_POST_TRANSMIT.TYPE.NUMBER:
          params.Text = `<speak><prosody rate="x-slow">${reqPostTransmitVo.number}</prosody><prosody rate="slow">번 차량 수리완료되었습니다. 사무실로 와주세요.</prosody></speak>`;
          break;
        case CONST_COMMON.MAIN_POST_TRANSMIT.TYPE.NAME:
          params.Text = `<speak><prosody rate="x-slow">${reqPostTransmitVo.name}</prosody><prosody rate="slow">님  사무실로 와주세요.</prosody></speak>`;
          break;
      }
      let audioFile = await audio_file.findOne({
        where: {
          audioType: `${reqPostTransmitVo.type}`,
          audioText: params.Text,
          fileType: params.OutputFormat,
        },
      });
      if (audioFile) {
      } else {
        const command = new StartSpeechSynthesisTaskCommand(params);

        const resPolly = await this.pollyClient.send(command);

        audioFile = await audio_file.create(
          {
            audioType: `${reqPostTransmitVo.type}`,
            audioText: params.Text,
            fileName: fileName,
            fileType: params.OutputFormat,
            fileUrl: resPolly.SynthesisTask.OutputUri,
          },
          { transaction: transaction }
        );
      }

      const expiredAt = moment(new Date()).add(10, "m").toDate(); // 유효시간은 10분
      if (reqPostTransmitVo.place === "전체") {
        // 전체 방송
        const userPlaces = await this.userPlaceRepository.findAll({
          where: {
            userId: reqPostTransmitVo.id,
          },
        });
        if (!userPlaces) {
          throw new BadRequestException(
            CONST_RESULT_CODE_MSG.ERROR.USER_PLACE.NOT_FOUND.CODE,
            CONST_RESULT_CODE_MSG.ERROR.USER_PLACE.NOT_FOUND.MSG
          );
        }
        const audioProcessList = [];
        userPlaces.forEach((val) => {
          audioProcessList.push({
            audioKey: audioFile.audioKey,
            userPlaceKey: val.userPlaceKey,
            expiredAt: expiredAt,
          });
        });
        await this.audioProcessRepository.bulkCreate(audioProcessList, {
          transaction: transaction,
        });
      } else {
        // 특정 위치
        const userPlace = await this.userPlaceRepository.findOne({
          where: {
            userId: reqPostTransmitVo.id,
            userPlaceName: reqPostTransmitVo.place,
          },
        });
        if (!userPlace) {
          throw new BadRequestException(
            CONST_RESULT_CODE_MSG.ERROR.USER_PLACE.NOT_FOUND.CODE,
            CONST_RESULT_CODE_MSG.ERROR.USER_PLACE.NOT_FOUND.MSG
          );
        }
        await this.audioProcessRepository.create(
          {
            audioKey: audioFile.audioKey,
            userPlaceKey: userPlace.userPlaceKey,
            expiredAt: expiredAt,
          },
          { transaction: transaction }
        );
      }
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  public async postRequestResultVo(reqPostRequestVo: ReqPostRequestVo) {
    try {
      const audioProcess = await this.audioProcessRepository.findOne({
        where: {
          expiredAt: {
            [Op.gt]: new Date(),
          },
        },
        include: [
          {
            model: audio_file,
            as: "audio_file",
          },
          {
            model: user_place,
            as: "user_place",
            where: {
              userPlaceName: reqPostRequestVo.place,
              userId: reqPostRequestVo.id,
            },
          },
        ],
        order: [["audioProcessKey", "ASC"]],
      });
      if (audioProcess) {
        await this.audioProcessRepository.update(
          {
            expiredAt: new Date(),
          },
          {
            where: { audioProcessKey: audioProcess.audioProcessKey },
          }
        );
      }
      return audioProcess;
    } catch (e) {
      throw e;
    }
  }

  public async postGetGrpMemResultVo(reqPostGetGrpMemVo: ReqPostGetGrpMemVo) {
    try {
      const user = await this.userRepository.findOne({
        where: { userId: reqPostGetGrpMemVo.id },
      });
      if (user == null) {
        throw new BadRequestException(
          CONST_RESULT_CODE_MSG.ERROR.DEFAULT.CODE,
          CONST_RESULT_CODE_MSG.ERROR.DEFAULT.MSG
        );
      }
      const userGroupMembers = await this.userGroupMemberRepository.findAll({
        where: {
          userId: reqPostGetGrpMemVo.id,
        },
      });

      return userGroupMembers;
    } catch (e) {
      throw e;
    }
  }
}

/* eslint-disable @typescript-eslint/no-var-requires */
// DB 테이블 모두 생성후 실행 -> 이전 DB 값들 사라짐
// node migration/sequelize-auto.js
const SequelizeAuto = require("sequelize-auto");
// import SequelizeAuto from "sequelize-auto";
const auto = new SequelizeAuto("broadcast_speaker", "mariadb", "mariadb", {
  host: "127.0.0.1",
  port: "3306",
  dialect: "mariadb",
  directory: "src/common/db/model/table/",
  lang: "ts",
  additional: {
    timestamps: true,
    paranoid: true,
  },
  //noAlias: true // as 별칭 미설정 여부
});
auto.run((err) => {
  if (err) throw err;
});

/*
createdAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
updatedAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
deletedAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
*/

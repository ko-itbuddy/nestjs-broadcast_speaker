export const CONST_RESULT_CODE_MSG = {
  SUCCESS: { CODE: "2000000", MSG: "정상 처리" },
  ERROR: {
    DEFAULT: { CODE: "4000000", MSG: "에러" },
    USER: {
      LOGIN_FAIL: { CODE: "4000001", MSG: "로그인 실패" },
      SIGNUP_FAIL: { CODE: "4000002", MSG: "회원가입 실패" },
      DUPLICATE_ID: { CODE: "4000003", MSG: "이미 존재하는 아이디" },
      DUPLICATE_EMAIL: { CODE: "4000004", MSG: "이미 존재하는 이메일" },
    },
    USER_PLACE: {
      NOT_FOUND: { CODE: "4000005", MSG: "해당하는 장소가 없습니다." },
    },
  },
};

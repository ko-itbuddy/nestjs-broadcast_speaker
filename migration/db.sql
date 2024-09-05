CREATE TABLE audio_file
(
    audiokey  BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    audiotext VARCHAR(200) NULL,
    audiotype VARCHAR(10)  NULL,
    audioKeyText VARCHAR(10) NOT NULL,
    filesize  BIGINT       NULL,
    filetype  VARCHAR(10)  NULL,
    filename  VARCHAR(50)  NULL,
    fileurl   TEXT         NULL,
    createdat DATETIME     NULL,
    updatedat DATETIME     NULL,
    deletedat DATETIME     NULL
)
    ENGINE = InnoDB;

CREATE INDEX audio_file_audiotype_index
    ON audio_file (audiotype);

CREATE INDEX audio_file_auditext_audiokey_index
    ON audio_file (audiotext, audiokey);

CREATE INDEX audio_file_deletedat_index
    ON audio_file (deletedat);

CREATE TABLE user
(
    userid               VARCHAR(30)  NOT NULL
        PRIMARY KEY,
    useremail            VARCHAR(254) NULL,
    username             CHAR(10)     NULL,
    userpasswd           CHAR(64)     NULL,
    userpasswdsalt       CHAR(10)     NULL,
    roles                VARCHAR(255) NULL,
    credentialsexpiredat DATETIME     NULL,
    lockedat             DATETIME     NULL,
    createdat            DATETIME     NULL,
    updatedat            DATETIME     NULL,
    deletedat            DATETIME     NULL,
    expiredat            DATETIME     NULL
)
    ENGINE = InnoDB;

CREATE TABLE pay_log
(
    paylogkey  BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    userid     VARCHAR(30)  NOT NULL,
    payinfo    VARCHAR(500) NULL,
    createdat  DATETIME     NULL,
    updatedat  DATETIME     NULL,
    deletedat  DATETIME     NULL,
    canceledat DATETIME     NULL,
    CONSTRAINT fk_user_to_pay_log_1
        FOREIGN KEY (userid) REFERENCES user (userid)
)
    ENGINE = InnoDB;

CREATE INDEX pay_log_deletedat_index
    ON pay_log (deletedat);

CREATE INDEX user_deletedat_index
    ON user (deletedat);

CREATE TABLE user_group
(
    usergrpkey  BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    userid      VARCHAR(30) NOT NULL,
    usergrpname VARCHAR(50) NULL,
    createdat   DATETIME    NULL,
    updatedat   DATETIME    NULL,
    deletedat   DATETIME    NULL,
    CONSTRAINT user_group_user_userid_fk
        FOREIGN KEY (userid) REFERENCES user (userid)
            ON UPDATE CASCADE ON DELETE CASCADE
)
    ENGINE = InnoDB;

CREATE INDEX user_group_deletedat_index
    ON user_group (deletedat);

CREATE TABLE user_group_member
(
    usergrpmemkey BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    usergrpkey    BIGINT      NOT NULL,
    userid        VARCHAR(30) NOT NULL,
    memname       CHAR(10)    NULL,
    createdat     DATETIME    NULL,
    updatedat     DATETIME    NULL,
    deletedat     DATETIME    NULL,
    CONSTRAINT user_gorup_member_user_group_usergrpkey_fk
        FOREIGN KEY (usergrpkey) REFERENCES user_group (usergrpkey)
)
    ENGINE = InnoDB;

CREATE INDEX user_group_member_deletedat_index
    ON user_group_member (deletedat);

CREATE TABLE user_place
(
    userplacekey  BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    userid        VARCHAR(30) NOT NULL,
    userplacename VARCHAR(50) NULL,
    userplaceseq  INT         NULL,
    createdat     DATETIME    NULL,
    updatedat     DATETIME    NULL,
    deletedat     DATETIME    NULL,
    CONSTRAINT fk_user_to_user_place_1
        FOREIGN KEY (userid) REFERENCES user (userid)
)
    ENGINE = InnoDB;

CREATE TABLE audio_process
(
    audioprocesskey  BIGINT AUTO_INCREMENT
        PRIMARY KEY,
    userplacekey     BIGINT       NOT NULL,
    audiokey         BIGINT       NULL,
    audioprocessinfo VARCHAR(500) NULL,
    createdat        DATETIME     NULL,
    updatedat        DATETIME     NULL,
    deletedat        DATETIME     NULL,
    expiredat        DATETIME     NULL,
    CONSTRAINT fk_audio_file_to_audio_process_1
        FOREIGN KEY (audiokey) REFERENCES audio_file (audiokey),
    CONSTRAINT fk_user_place_to_audio_process_1
        FOREIGN KEY (userplacekey) REFERENCES user_place (userplacekey)
)
    ENGINE = InnoDB;

CREATE INDEX audio_process_deletedat_index
    ON audio_process (deletedat);

CREATE INDEX audio_process_expiredat_index
    ON audio_process (expiredat);

CREATE INDEX user_place_deletedat_index
    ON user_place (deletedat);

CREATE INDEX user_place_userplacename_index
    ON user_place (userplacename);


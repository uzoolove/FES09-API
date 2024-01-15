import _ from 'lodash';
import moment from 'moment';

import logger from '#utils/logger.js';
import db, { nextSeq } from '#utils/dbUtil.js';

const user = {
  // 회원 가입
  async create(userInfo){
    logger.trace(arguments);
    userInfo._id = await nextSeq('user');
    userInfo.updatedAt = userInfo.createdAt = moment().format('YYYY.MM.DD HH:mm:ss');
    if(!userInfo.dryRun){
      await db.user.insertOne(userInfo);
    }
    delete userInfo.password;
    return userInfo;
  },

  // 회원 정보 조회(단일 속성)
  async findAttrById(_id, attr){
    logger.trace(arguments);
    const item = await db.user.findOne({ _id }, { projection: { [attr]: 1, _id: 0 }});
    logger.debug(item);
    return item;
  },

  // 지정한 속성으로 회원 정보 조회
  async findBy(query){
    logger.trace(arguments);
    const item = await db.user.findOne(query);
    logger.debug(item);
    return item;
  },

  // 회원 정보 조회(여러 속성)
  async findAttrListById(_id, projection){
    logger.trace(arguments);
    const item = await db.user.findOne({ _id }, { projection: { ...projection, _id: 0 }});
    logger.debug(item);
    return item;
  },

  // 회원 정보 조회(모든 속성)
  async findById(_id){
    logger.trace(arguments);
    const item = await db.user.findOne({_id});
    logger.debug(item);
    if(item){
      delete item.password;
    }
    return item;
  },

  // 회원 정보 수정
  async update(_id, userInfo){
    logger.trace(arguments);
    userInfo.updatedAt = moment().format('YYYY.MM.DD HH:mm:ss');
    const result = await db.user.updateOne({ _id }, { $set: userInfo });
    logger.debug(result);
    const item = await this.findAttrListById(_id, _.mapValues(userInfo, () => 1));
    return item;
  },

  // refreshToken 수정
  async updateRefreshToken(_id, refreshToken){
    logger.trace(arguments);
    const result = await db.user.updateOne({ _id }, { $set: { refreshToken } });
    logger.debug(result);
    return true;
  },
};

export default user;
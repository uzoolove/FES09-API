import _ from 'lodash';
import moment from 'moment-timezone';

import logger from '#utils/logger.js';

class UserModel{
  constructor(db, model){
    this.db = db;
    this.model = model;
  }
  
  // 회원 가입
  async create(userInfo){
    logger.trace(arguments);
    userInfo._id = await this.db.nextSeq('user');
    userInfo.updatedAt = userInfo.createdAt = moment().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm:ss');
    if(!userInfo.dryRun){
      await this.db.user.insertOne(userInfo);
    }
    delete userInfo.password;
    return userInfo;
  }

  // 회원 정보 조회(단일 속성)
  async findAttrById(_id, attr){
    logger.trace(arguments);
    const item = await this.db.user.findOne({ _id }, { projection: { [attr]: 1, _id: 0 }});
    logger.debug(item);
    return item;
  }

  // 지정한 속성으로 회원 정보 조회
  async findBy(query){
    logger.trace(arguments);
    const item = await this.db.user.findOne(query);
    logger.debug(item);
    return item;
  }

  // 회원 정보 조회(여러 속성)
  async findAttrListById(_id, projection){
    logger.trace(arguments);
    const item = await this.db.user.findOne({ _id }, { projection: { ...projection, _id: 0 }});
    logger.debug(item);
    return item;
  }

  // 회원 정보 조회(모든 속성)
  async findById(_id){
    logger.trace(arguments);
    const item = await this.db.user.findOne({ _id }, { projection: { password: 0, refreshToken: 0, }});
    logger.debug(item);
    return item;
  }

  // 회원 정보 수정
  async update(_id, userInfo){
    logger.trace(arguments);
    userInfo.updatedAt = moment().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm:ss');
    const result = await this.db.user.updateOne({ _id }, { $set: userInfo });
    logger.debug(result);
    const item = await this.findAttrListById(_id, _.mapValues(userInfo, () => 1));
    return item;
  }

  // refreshToken 수정
  async updateRefreshToken(_id, refreshToken){
    logger.trace(arguments);
    const result = await this.db.user.updateOne({ _id }, { $set: { refreshToken } });
    logger.debug(result);
    return true;
  }
};

export default UserModel;
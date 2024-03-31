import bcrypt from 'bcrypt';
import createError from 'http-errors';

import logger from '../utils/logger.js';
import authService from './auth.service.js';


const userService = {
  // 회원 가입
  async signup(userModel, userInfo){
    logger.trace(userInfo);

    let user = await userModel.findBy({ email: userInfo.email });
    if(user){
      throw createError(409, '이미 등록된 이메일입니다.');
    }else{
      const salt = await bcrypt.genSalt();
      userInfo.password = await bcrypt.hash(userInfo.password, salt);

      const newUser = await userModel.create(userInfo);
      return newUser;
    }
  },

  // 로그인
  async login(userModel, { email, password }){
    const user = await userModel.findBy({ email });
    logger.log(user);
    if(user){
      const isSame = await bcrypt.compare(password, user.password);
      if(isSame){
        const token = await authService.sign({ _id: user._id, type: user.type, name: user.name, profile: user.profileImage });
        logger.log('token', token);
        await userModel.updateRefreshToken(user._id, token.refreshToken);
        user.token = token;
        delete user.password;
        delete user.refreshToken;
        return user;
      }
    }
    // 401은 토큰 인증 오류에 사용하므로 로그인 실패는 403(권한없음)으로 사용
    throw createError(403, '아이디와 패스워드를 확인하시기 바랍니다.');
  },

  // 회원정보 수정
  async update(userModel, id, updateInfo){
    let password = updateInfo.password;
    if(updateInfo.password){
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateInfo.password, salt);
      updateInfo.password = hashedPassword;
    }
    const updated = await userModel.update(id, updateInfo);
    if(updated && password){
      // 암호화 이전의 비밀번호
      updated.password = password;
    }
    return updated;
  }
};

export default userService;

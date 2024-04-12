import express from 'express';
import { query, body } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import jwtAuth from '#middlewares/jwtAuth.js';
import userService from '#services/user.service.js';

const router = express.Router();

// 회원 가입
router.post('/', [
  body('email').isEmail().withMessage('이메일 형식에 맞지 않습니다.'),
  body('password').trim().isLength({ min: 8 }).withMessage('8자리 이상 입력해야 합니다.'),
  body('name').trim().notEmpty().withMessage('이름은 필수로 입력해야 합니다.'),
  body('phone').optional().matches(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/).withMessage('휴대폰 형식에 맞지 않습니다.'),
  body('type').matches(/^(user|seller)$/).withMessage('회원 구분은 user 또는 seller로 전달해야 합니다.'),
  body('extra').optional().isObject().withMessage('extra 데이터는 객체로 전달해야 합니다.'),
], validator.checkResult, async function(req, res, next) {
  /*
    #swagger.tags = ['회원']
    #swagger.summary  = '회원 가입'
    #swagger.description = '회원 가입을 합니다.<br>회원 가입을 완료한 후 회원 정보를 반환합니다.'

    #swagger.requestBody = {
      description: "회원 정보가 저장된 객체입니다.<br>email: 이메일(필수)<br>password: 비밀번호(필수)<br>name: 이름(필수)<br>phone: 전화번호(선택)<br>address: 주소(선택)<br>type: 회원 구분(필수, 구매회원: user, 판매회원: seller)<br>extra: 추가 데이터(선택). 추가하고 싶은 아무 속성이나 지정",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#components/schemas/createUser' },
          examples: {
            "기본 속성": { $ref: "#/components/examples/createUser" },
            "extra 속성": { $ref: "#/components/examples/createUserWithExtra" }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: '성공',
      content: {
        "application/json": {
          examples: {
            "기본 속성": { $ref: "#/components/examples/createUserRes" },
            "extra 속성": { $ref: "#/components/examples/createUserResWithExtra" }
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: '이메일 중복됨',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error409' }
        }
      }
    }
    #swagger.responses[422] = {
      description: '입력값 검증 오류',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error422' }
        }
      }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error500' }
        }
      }
    }
  */

  try{
    const userModel = req.model.user;
    const item = await userService.signup(userModel, req.body);
    res.status(201).json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 이메일 중복 체크
router.get('/email', [
  query('email').isEmail().withMessage('이메일 형식에 맞지 않습니다.'),
], validator.checkResult, async function(req, res, next) {
  /*
    #swagger.tags = ['회원']
    #swagger.summary  = '이메일 중복 체크'
    #swagger.description = '이메일 중복 여부를 체크 합니다.'

    #swagger.parameters['email'] = {
      description: '이메일',
      in: 'query',
      required: true,
      type: 'string',
      format: 'email',
      example: 'hello@market.com'
    }
    
    #swagger.responses[200] = {
      description: '중복되지 않음',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/simpleOK' }
        }
      }
    }
    #swagger.responses[409] = {
      description: '이메일 중복됨',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error409' }
        }
      }
    }

  */

  try{
    const userModel = req.model.user;
    const user = await userModel.findBy({ email: req.query.email });
    if(user){
      res.status(409).json({ ok: 0, message: '이미 등록된 이메일입니다.' });
    }else{
      res.status(200).json({ ok: 1 });
    }
  }catch(err){
    next(err);
  }
});

// 로그인
router.post('/login', [
  body('email').isEmail().withMessage('이메일 형식에 맞지 않습니다.'),
  body('password').trim().isLength({ min: 8 }).withMessage('8자리 이상 입력해야 합니다.'),
], validator.checkResult, async function(req, res, next) {
  /*
    #swagger.tags = ['회원']
    #swagger.summary  = '로그인'
    #swagger.description = '이메일과 비밀번호를 입력해 로그인을 한다.<br>응답 데이터에 token 속성으로 JWT 기반의 Access Token과 Refresh Token을 반환한다.<br>이후 로그인이 필요한 모든 요청에는 Authorization 헤더에 Bearer 방식의 Access Token을 보내야 한다.'

    #swagger.requestBody = {
      description: "로그인 정보",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#components/schemas/login' },
        }
      }
    }

    #swagger.responses[200] = {
      description: '로그인 성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/loginRes" }
        }
      }
    }
    #swagger.responses[403] = {
      description: '로그인 실패',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error403" }
        }
      }
    }
    #swagger.responses[422] = {
      description: '입력값 검증 오류',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error422' }
        }
      }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error500' }
        }
      }
    }
  */

  try{
    const userModel = req.model.user;
    const user = await userService.login(userModel, req.body);
    if(user.extra?.confirm === false){
      res.status(403).json({ ok: 0, message: '관리자의 승인이 필요합니다.' });
    }else{
      res.json({ ok: 1, item: user });
    }
  }catch(err){
    next(err);
  }
});

// 로그인
router.get('/login/kakao', async function(req, res, next) {
  /*
    #swagger.tags = ['회원']
    #swagger.summary  = '로그인'
    #swagger.description = '이메일과 비밀번호를 입력해 로그인을 한다.<br>응답 데이터에 token 속성으로 JWT 기반의 Access Token과 Refresh Token을 반환한다.<br>이후 로그인이 필요한 모든 요청에는 Authorization 헤더에 Bearer 방식의 Access Token을 보내야 한다.'

    #swagger.requestBody = {
      description: "로그인 정보",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#components/schemas/login' },
        }
      }
    }

    #swagger.responses[200] = {
      description: '로그인 성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/loginRes" }
        }
      }
    }
    #swagger.responses[403] = {
      description: '로그인 실패',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error403" }
        }
      }
    }
    #swagger.responses[422] = {
      description: '입력값 검증 오류',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error422' }
        }
      }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error500' }
        }
      }
    }
  */

  try{

    logger.trace(req.query.code);
    const userModel = req.model.user;
    const user = {
      _id: 111,
    };

    res.redirect('http://localhost:5173/users/signup');
  }catch(err){
    next(err);
  }
});

// 회원 조회(단일 속성)
router.get('/:_id/*', jwtAuth.auth('user'), async function(req, res, next) {
  /*  
    #swagger.auto = false

    #swagger.tags = ['회원']
    #swagger.summary  = '회원 정보 조회(단일 속성)'
    #swagger.description = '회원 정보 중 한가지 속성을 조회한다.'

    #swagger.path = '/users/{_id}/{*}'
    #swagger.method = 'get'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']

    #swagger.security = [{
      "Access Token": []
    }]

    #swagger.parameters['_id'] = {
      description: "조회할 회원 id",
      in: 'path',
      type: 'number',
      example: '5'
    }
    #swagger.parameters['*'] = {
      description: "조회할 속성<br>단일 속성 조회 예시: name<br>중첩 속성 조회 예시: extra/addressBook",
      in: 'path',
      type: 'string',
      example: 'name'
    }

    #swagger.responses[200] = {
      description: '성공',
      content: {
        "application/json": {
          examples: {
            "users/5/name 조회": { $ref: "#/components/examples/userInfoResOneAttr" },
            "users/5/extra/addressBook 조회": { $ref: "#/components/examples/userInfoResWithExtra" }
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: '인증 실패',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error401" }
        }
      }
    }
    #swagger.responses[404] = {
      description: '회원이 존재하지 않거나 접근 권한 없음',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error404" }
        }
      }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error500' }
        }
      }
    }
  */

  try{
    const userModel = req.model.user;
    if(req.user.type === 'admin' || req.params._id == req.user._id){
      logger.trace(req.params);
      const attr = req.params[0].replaceAll('/', '.');
      logger.log(attr);
      const item = await userModel.findAttrById(Number(req.params._id), attr);
      res.json({ok: 1, item});
    }else{
      next(); // 404
    }
  }catch(err){
    next(err);
  }
});

// 회원 조회(모든 속성)
router.get('/:_id', jwtAuth.auth('user'), async function(req, res, next) {
  /*
    #swagger.tags = ['회원']
    #swagger.summary  = '회원 정보 조회(모든 속성)'
    #swagger.description = '회원 정보의 모든 속성을 조회한다.'

    #swagger.security = [{
      "Access Token": []
    }]

    #swagger.parameters['_id'] = {
      description: "조회할 회원 id",
      in: 'path',
      type: 'number',
      example: '5'
    }

    #swagger.responses[200] = {
      description: '성공',
      content: {
        "application/json": {
          examples: {
            "기본 속성": { $ref: "#/components/examples/createUserRes" },
            "extra 속성": { $ref: "#/components/examples/createUserResWithExtra" }
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: '인증 실패',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error401" }
        }
      }
    }
    #swagger.responses[404] = {
      description: '회원이 존재하지 않거나 접근 권한 없음',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error404" }
        }
      }
    }
    #swagger.responses[500] = {
      description: '서버 에러',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error500' }
        }
      }
    }
  */

  try{
    const userModel = req.model.user;
    if(req.user.type === 'admin' || req.params._id == req.user._id){
      const result = await userModel.findById(Number(req.params._id));
      
      if(result){
        delete result.refreshToken;
        res.json({ok: 1, item: result});
      }else{
        next();
      }      
    }else{
      next(); // 404
    }
  }catch(err){
    next(err);
  }
});

// 회원 수정
router.patch('/:_id', jwtAuth.auth('user'), async function(req, res, next) {
  /*
    #swagger.tags = ['회원']
    #swagger.summary  = '회원 정보 수정'
    #swagger.description = '회원 정보를 수정한다.'

    #swagger.security = [{
      "Access Token": []
    }]

    #swagger.parameters['_id'] = {
      description: "회원 id",
      in: 'path',
      type: 'number',
      example: '5'
    }

    #swagger.requestBody = {
      description: "수정할 회원 정보",
      required: true,
      content: {
        "application/json": {
          examples: {
            "기본 속성": { $ref: "#/components/examples/updateUserOneAttr" },
            "extra 속성": { $ref: "#/components/examples/updateUserWithExtra" }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: '성공',
      content: {
        "application/json": {
          examples: {
            "기본 속성": { $ref: "#/components/examples/updateUserResOneAttr" },
            "extra 속성": { $ref: "#/components/examples/updateUserResWithExtra" }
          }
        }
      }
    },
    #swagger.responses[401] = {
      description: '인증 실패',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error401" }
        }
      }
    },
    #swagger.responses[404] = {
      description: '회원이 존재하지 않거나 접근 권한 없음',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/error404" }
        }
      }
    },
    #swagger.responses[500] = {
      description: '서버 에러',
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/error500' }
        }
      }
    }
  */

  try{
    const userModel = req.model.user;
    logger.trace(req.body);
    const _id = Number(req.params._id);
    if(req.user.type === 'admin' || _id === req.user._id){
      if(req.user.type !== 'admin'){ // 관리자가 아니라면 회원 타입과 회원 승인 정보는 수정 못함
        delete req.body.type;
        delete (req.body.extra && req.body.extra.confirm);
        if(req.body['extra.confirm'] === true){ // 일반 유저가 confirm 처리하지 못하도록
          delete req.body['extra.confirm'];
        }
      }
      const updated = await userService.update(userModel, _id, req.body);
      if(updated){
        res.json({ ok: 1, updated });
      }else{
        next();
      }
    }else{
      next(); // 404
    }
  }catch(err){
    next(err);
  }
});

export default router;

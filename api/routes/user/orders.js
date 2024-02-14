import express from 'express';
import { query, body } from 'express-validator';
import moment from 'moment';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/order.model.js';

const router = express.Router();

// 상품 구매
router.post('/', [
  body('products').isArray().withMessage('상품 목록은 배열로 전달해야 합니다.'),
  body('products.*._id').isInt().withMessage('상품 id는 정수만 입력 가능합니다.'),
  body('products.*.quantity').isInt().withMessage('상품 수량은 정수만 입력 가능합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['구매']
    #swagger.summary  = '상품 구매 - 필수'
    #swagger.description = '상품을 구매한다.'

    #swagger.security = [{
      "Access Token": []
    }]
    
    #swagger.requestBody = {
      description: "구매 정보",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#components/schemas/orderCreate' }
        }
      }
    },
    #swagger.responses[201] = {
      description: '성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/orderCreateRes" }
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
    req.body.state = req.body.state || 'OS020'; // 결제 완료 상태로 주문
    const item = await model.create({ ...req.body, user_id: req.user._id });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 구매 목록 조회
router.get('/', [
  query('custom').optional().isJSON().withMessage('custom 값은 JSON 형식의 문자열이어야 합니다.'),
  query('sort').optional().isJSON().withMessage('sort 값은 JSON 형식의 문자열이어야 합니다.')
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['구매']
    #swagger.summary  = '구매 목록 조회 - 필수'
    #swagger.description = '구매 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]

  */

try{
  logger.trace(req.query);

  // 검색 옵션
  let search = {};
  const keyword = req.query.keyword;
  const custom = req.query.custom;

  if(keyword){
    const regex = new RegExp(keyword, 'i');
    search['products'] = { $elemMatch: { name: { '$regex': regex } } };
  }
  
  if(custom){
    search = { ...search, ...JSON.parse(custom) };
  }

  // 정렬 옵션
  let sortBy = JSON.parse(req.query.sort || '{}');

  // 기본 정렬 옵션은 등록일의 내림차순
  sortBy['createdAt'] = sortBy['createdAt'] || -1; // 내림차순

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 0);

  const result = await model.findBy({ user_id: req.user._id, search, sortBy, page, limit });
  
  res.json({ ok: 1, ...result });
}catch(err){
  next(err);
}
});

// 구매 목록의 상태값만 조회
router.get('/state', async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['구매']
    #swagger.summary  = '구매 목록의 상태값 조회'
    #swagger.description = '구매 목록의 상태값을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]

  */

  try{
    const item = await model.findState(req.user._id);
    res.json({ ok: 1, item });
  }catch(err){
    next(err);
  }
});

// 구매 상세 조회
router.get('/:_id', async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['구매']
    #swagger.summary  = '구매 상세 조회'
    #swagger.description = '구매 상세 내역을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]

  */

  try{
    const item = await model.findById(Number(req.params._id), req.user._id);
    if(item){
      res.json({ ok: 1, item });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 상품별 주문 상태 수정
router.patch('/:_id/products/:product_id', async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['구매']
    #swagger.summary  = '상품별 주문 상태 수정'
    #swagger.description = '상품별로 주문 상태를 수정한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]

  */

  try{
    logger.trace(req.query);
    const _id = Number(req.params._id);
    const product_id = Number(req.params.product_id);
    const order = await model.findById(_id);
    if(req.user.type === 'admin' || req.user._id === order.user_id){
      const history = {
        actor: req.user._id,
        updated: { ...req.body },
        createdAt: moment().format('YYYY.MM.DD HH:mm:ss')
      };
      const result = await model.updateStateByProduct(_id, product_id, req.body, history);
      res.json({ok: 1, updated: result});
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 주문별 주문 상태 수정
router.patch('/:_id', async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['구매']
    #swagger.summary  = '주문별 주문 상태 수정'
    #swagger.description = '주문별로 주문 상태를 수정한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]

  */

  try{
    logger.trace(req.query);
    const _id = Number(req.params._id);
    const order = await model.findById(_id);
    if(req.user.type === 'admin' || req.user._id === order.user_id){
      const history = {
        actor: req.user._id,
        updated: { ...req.body },
        createdAt: moment().format('YYYY.MM.DD HH:mm:ss')
      };
      const result = await model.updateState(_id, req.body, history);
      res.json({ok: 1, updated: result});
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

export default router;

import express from 'express';
import { query, body } from 'express-validator';
import createError from 'http-errors';
import _ from 'lodash';

import logger from '#utils/logger.js';
import jwtAuth from '#middlewares/jwtAuth.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/cart.model.js';

const router = express.Router();

// 장바구니 목록 조회(비로그인 상태)
router.post('/local', [
  body('products').isArray().withMessage('상품 목록은 배열로 전달해야 합니다.'),
  body('products.*._id').isInt().withMessage('상품 id는 정수만 입력 가능합니다.'),
  body('products.*.quantity').isInt().withMessage('상품 수량은 정수만 입력 가능합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 목록 조회(비로그인)'
    #swagger.description = '로그인 되지 않은 상태에서 장바구니 목록을 조회한다.'
    
  */

  try{
    const item = await model.findLocalCart(req.body);
    const cost = item.cost;
    delete item.cost;
    res.json({ ok: 1, item, cost });
  }catch(err){
    next(err);
  }
});

// 장바구니 목록 조회(로그인 상태)
router.get('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 목록 조회(로그인)'
    #swagger.description = '로그한 사용자의 장바구니 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const user_id = req.user._id;
    const item = await model.findByUser(user_id, req.body.discount);
    const cost = item.cost;
    delete item.cost;
    res.json({ ok: 1, item, cost });
  }catch(err){
    next(err);
  }
});

// 장바구니에 담기
router.post('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니에 상품 추가'
    #swagger.description = '장바구니에 상품을 추가한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    req.body.user_id = req.user._id;
    const item = await model.create(req.body);
    res.status(201).json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 장바구니 상품 수량 수정
router.patch('/:_id', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 상품 수량 수정'
    #swagger.description = '장바구니 상품의 수량을 수정한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */


  try{
    const _id = Number(req.params._id);
    const cart = await model.findById(_id);
    if(req.user.type === 'admin' || cart?.user_id == req.user._id){
      const updated = await model.update(_id, req.body.quantity);
      res.json({ ok: 1, updated });
    }else{
      next(); // 404
    }
  }catch(err){
    next(err);
  }
});

// 장바구니 비우기
router.delete('/cleanup', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 비우기'
    #swagger.description = '장바구니를 비운다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const result = await model.cleanup(req.user._id);
    res.json({ ok: 1 });
  }catch(err){
    next(err);
  }
});

// 장바구니 상품 삭제(한건)
router.delete('/:_id', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 상품 한건 삭제'
    #swagger.description = '장바구니 상품을 한건 삭제한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    const cart = await model.findById(_id);
    if(req.user.type === 'admin' || cart?.user_id == req.user._id){
      await model.delete(_id);
      res.json({ ok: 1 });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 장바구니 상품 삭제(여러건)
router.delete('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 상품 여러건 삭제'
    #swagger.description = '장바구니 상품을 여러건 삭제한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const myCarts = await model.findByUser(req.user._id);
    const isMine = _.every(req.body.carts, _id => _.some(myCarts, cart => _.isEqual(cart._id, _id)));
    if(req.user.type === 'admin' || isMine){
      await model.deleteMany(req.body.carts);
      res.json({ ok: 1 });
    }else{
      next(createError(422, `본인의 장바구니 상품만 삭제 가능합니다.`));
    }
  }catch(err){
    next(err);
  }
});

// 장바구니 상품 전체 교체
router.put('/replace', jwtAuth.auth('user'), [
  body('products').isArray().withMessage('products 항목은 배열로 전달해야 합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 상품 전체 교체'
    #swagger.description = '장바구니 상품 전체를 교체한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    await model.cleanup(req.user._id);
    const item = await model.add(req.user._id, req.body.products);
    res.json({ ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 장바구니 상품 합치기
router.put('/', jwtAuth.auth('user'), [
  body('products').isArray().withMessage('products 항목은 배열로 전달해야 합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['장바구니']
    #swagger.summary  = '장바구니 합치기'
    #swagger.description = '지정한 상품을 장바구니에 합친다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const item = await model.add(req.user._id, req.body.products);
    res.json({ ok: 1, item});
  }catch(err){
    next(err);
  }
});



export default router;

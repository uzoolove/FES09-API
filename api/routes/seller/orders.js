import _ from 'lodash';
import moment from 'moment';
import express from 'express';
import { query, body } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/order.model.js';
import sellerModel from '#models/seller/order.model.js';

const router = express.Router();

// 판매자의 모든 주문 내역 조회
router.get('/', [
  query('custom').optional().isJSON().withMessage('custom 값은 JSON 형식의 문자열이어야 합니다.'),
  query('sort').optional().isJSON().withMessage('sort 값은 JSON 형식의 문자열이어야 합니다.')
], validator.checkResult, async function(req, res, next) {
  try{
    logger.trace(req.query);

    // 검색 옵션
    let search = {};
    const state = req.query.state;
    const custom = req.query.custom;

    if(state){
      search['state'] = state;
    }
    
    if(custom){
      search = { ...search, ...JSON.parse(custom) };
    }

    // 정렬 옵션
    let sortBy = JSON.parse(req.query.sort || '{}');

    // 기본 정렬 옵션은 구매일의 내림차순
    sortBy['createdAt'] = sortBy['createdAt'] || -1; // 내림차순

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 0);

    const result = await sellerModel.findBy({seller_id: req.user._id, search, sortBy, page, limit });
    res.json({ ok: 1, ...result });

  }catch(err){
    next(err);
  }
});

// 주문 상세 조회
router.get('/:_id', async function(req, res, next) {
  try{
    const item = await sellerModel.findById(Number(req.params._id), req.user._id);
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
  try{
    const _id = Number(req.params._id);
    const product_id = Number(req.params.product_id);
    const order = await model.findById(_id);

    // 주문 내역 중 내 상품만 조회
    const orderProducts = _.filter(order.products, { _id: product_id, seller_id: req.user._id });

    if(req.user.type === 'admin' || orderProducts.length > 0){
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
  try{
    const _id = Number(req.params._id);
    const order = await model.findById(_id);

    // 주문 내역 중 내 상품만 조회
    const orderProducts = _.filter(order.products, { seller_id: req.user._id });

    if(req.user.type === 'admin' || orderProducts.length > 0){
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

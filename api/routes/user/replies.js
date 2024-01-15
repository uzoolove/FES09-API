import express from 'express';
import { query } from 'express-validator';

import logger from '#utils/logger.js';
import jwtAuth from '#middlewares/jwtAuth.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/reply.model.js';

const router = express.Router();

// 구매 후기 등록
router.post('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '구매 후기 등록 - 1차'
    #swagger.description = '구매 후기를 등록한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */


  try{
    const item = await model.create({ ...req.body, user_id: req.user._id });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 모든 후기 목록 조회
router.get('/all', async function(req, res, next) {
  try{
    const item = await model.findBy();
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 지정한 상품 후기 조회
router.get('/products/:_id', async function(req, res, next) {
  try{
    const item = await model.findBy({ product_id: Number(req.params._id) });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 후기 상세 조회
router.get('/:_id', async function(req, res, next) {
  try{
    const item = await model.findBy({ _id: Number(req.params._id) });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 내 후기 목록 조회
router.get('/', jwtAuth.auth('user'), async function(req, res, next) {
  try{
    const item = await model.findBy( { user_id: req.user._id });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 판매자 후기 목록 조회
router.get('/seller/:seller_id', async function(req, res, next) {
  try{
    const seller_id = Number(req.params.seller_id);
    const item = await model.findBySeller(seller_id);
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

export default router;

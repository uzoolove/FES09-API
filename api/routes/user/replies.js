import express from 'express';
import { query } from 'express-validator';

import logger from '#utils/logger.js';
import jwtAuth from '#middlewares/jwtAuth.js';
import validator from '#middlewares/validator.js';

const router = express.Router();

// 구매 후기 등록
router.post('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '구매 후기 등록'
    #swagger.description = '구매 후기를 등록한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */


  try{
    const replyModel = req.model.reply;
    const item = await replyModel.create({ ...req.body, user_id: req.user._id });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 모든 후기 목록 조회
router.get('/all', async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '구매 후기 목록'
    #swagger.description = '모든 구매 후기 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const replyModel = req.model.reply;
    const item = await replyModel.findBy();
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 지정한 상품 후기 조회
router.get('/products/:_id', async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '상품 구매 후기 목록'
    #swagger.description = '지정한 상품의 구매 후기 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const replyModel = req.model.reply;
    const item = await replyModel.findBy({ product_id: Number(req.params._id) });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 후기 상세 조회
router.get('/:_id', async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '구매 후기 상세'
    #swagger.description = '구매 후기를 상세 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const replyModel = req.model.reply;
    const item = await replyModel.findBy({ _id: Number(req.params._id) });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 내 후기 목록 조회
router.get('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '내 구매 후기 목록'
    #swagger.description = '내가 등록한 모든 구매 후기 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const replyModel = req.model.reply;
    const item = await replyModel.findBy( { user_id: req.user._id });
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

// 판매자 후기 목록 조회
router.get('/seller/:seller_id', async function(req, res, next) {

  /*
    #swagger.tags = ['구매 후기']
    #swagger.summary  = '판매자 구매 후기 목록'
    #swagger.description = '판매자의 상품에 등록된 모든 구매 후기 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const replyModel = req.model.reply;
    const seller_id = Number(req.params.seller_id);
    const item = await replyModel.findBySeller(seller_id);
    res.json({ok: 1, item});
  }catch(err){
    next(err);
  }
});

export default router;

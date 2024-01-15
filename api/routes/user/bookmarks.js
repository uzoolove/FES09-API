import express from 'express';
import { query, body } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/bookmark.model.js';

const router = express.Router();

// 북마크 등록
router.post('/', async function(req, res, next) {
  try{
    const bookmark = await model.findOneBy({ user_id: req.user._id, product_id: Number(req.body.product_id) });
    if(bookmark){
      res.status(409).json({ ok: 0, message: '이미 등록되어 있습니다.' });
    }else{
      const item = await model.create(req.body);
      res.status(201).json({ ok: 1, item });
    }    
  }catch(err){
    next(err);
  }
}); 

// 내 북마크 목록 조회
router.get('/', async function(req, res, next) {
  try{
    const item = await model.findBy({ user_id: req.user._id });
    res.json({ ok: 1, item });
  }catch(err){
    next(err);
  }
});

// 지정한 상품에 대한 나의 북마크 한건 조회
router.get('/products/:product_id', async function(req, res, next) {
  try{
    const item = await model.findOneBy({ user_id: req.user._id, product_id: Number(req.params.product_id) });
    if(item){
      res.json({ ok: 1, item });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 북마크 삭제
router.delete('/:_id', async function(req, res, next) {
  try{
    const _id = Number(req.params._id);
    const bookmark = await model.findOneBy({ _id });
    if(bookmark && (req.user._id === bookmark.user_id)){
      const result = await model.delete(_id);
      if(result.deletedCount){
        return res.json({ ok: 1 });
      }
    }
    next(); // 404    
  }catch(err){
    next(err);
  }
});

export default router;

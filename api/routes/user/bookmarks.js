import express from 'express';
import { param, query, body } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';

const router = express.Router();

// 북마크 추가
router.post('/:type/:target_id', [
  param('type').matches(/^(product|post|user)$/).withMessage('북마크 구분은 product, post, user로 전달해야 합니다.'),
  param('target_id').isInt().withMessage('북마크 대상 id는 정수만 입력 가능합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['북마크']
    #swagger.summary  = '북마크 추가'
    #swagger.description = '상품 | 사용자 | 게시글을 북마크에 추가합니다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
    #swagger.parameters['type'] = {
      description: '북마크 종류 (product | user | post)',
      in: 'path',
      required: true,
      type: 'string',
      example: 'product'
    }
    #swagger.parameters['target_id'] = {
      description: '북마크 대상 id (상품 id | 사용자 id | 게시글 id)',
      in: 'path',
      required: true,
      type: 'number',
      example: '2'
    }

    #swagger.responses[201] = {
      description: '성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/createUserResWithExtra" }
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
    #swagger.responses[409] = {
      description: '이미 추가된 북마크',
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
    const bookmarkModel = req.model.bookmark;
    const bookmarkInfo = {
      type: req.params.type,
      user_id: req.user._id,
      target_id: Number(req.params.target_id)
    };
    const bookmark = await bookmarkModel.findOneBy(bookmarkInfo);
    if(bookmark){
      res.status(409).json({ ok: 0, message: '이미 등록되어 있습니다.' });
    }else{
      Object.assign(bookmarkInfo, req.body);
      const item = await bookmarkModel.create(bookmarkInfo);
      res.status(201).json({ ok: 1, item });
    }
  }catch(err){
    next(err);
  }
}); 

// 내 북마크 목록 조회
router.get('/:type', [
  param('type').matches(/^(product|post|user)$/).withMessage('북마크 구분은 product, post, user로 전달해야 합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['북마크']
    #swagger.summary  = '북마크 목록 조회'
    #swagger.description = '사용자의 북마크 목록을 조회합니다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */
 
  try{
    const bookmarkModel = req.model.bookmark;
    const item = await bookmarkModel.findBy({ user_id: req.user._id, type: req.params.type });
    res.json({ ok: 1, item });
  }catch(err){
    next(err);
  }
});

// 지정한 상품|사용자|게시글에 대한 나의 북마크 한건 조회
router.get('/:type/:target_id', [
  param('type').matches(/^(product|post|user)$/).withMessage('북마크 구분은 product, post, user로 전달해야 합니다.'),
  param('target_id').isInt().withMessage('북마크 대상 id는 정수만 입력 가능합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['북마크']
    #swagger.summary  = '북마크 한건 조회'
    #swagger.description = '지정한 상품|사용자|게시글에 대한 나의 북마크 정보를 조회합니다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */
 
  try{
    const bookmarkModel = req.model.bookmark;
    const item = await bookmarkModel.findOneBy({ user_id: req.user._id, type: req.params.type, target_id: Number(req.params.target_id) });
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
router.delete('/:_id', [
  param('_id').isInt().withMessage('북마크 id는 정수만 입력 가능합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['북마크']
    #swagger.summary  = '북마크 삭제'
    #swagger.description = '북마크를 삭제한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const bookmarkModel = req.model.bookmark;
    const result = await bookmarkModel.delete({ user_id: req.user._id, _id: Number(req.params._id) });
    if(result.deletedCount){
      return res.json({ ok: 1 });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

export default router;

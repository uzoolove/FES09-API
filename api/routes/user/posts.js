import express from 'express';
import { query } from 'express-validator';
import _ from 'lodash';

import logger from '#utils/logger.js';
import jwtAuth from '#middlewares/jwtAuth.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/post.model.js';

const router = express.Router();

// 게시물 목록 조회
router.get('/', [
  query('custom').optional().isJSON().withMessage('custom 값은 JSON 형식의 문자열이어야 합니다.'),
  query('sort').optional().isJSON().withMessage('sort 값은 JSON 형식의 문자열이어야 합니다.')
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '전체 게시물 목록'
    #swagger.description = '전체 게시물 목록을 조회한다.'
    
  */

  try{
    let search = {};
    const keyword = req.query.keyword;
    const custom = req.query.custom;

    if(keyword){
      const regex = new RegExp(keyword, 'i');
      search['$or'] = [{ title: regex }, { content: regex }];
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

    const result = await model.find({ type: req.query.type, search, sortBy, page, limit });
    

    res.json({ ok: 1, ...result });
  }catch(err){
    next(err);
  }
});

// 사용자의 게시물 목록 조회
router.get('/users/:_id', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '사용자 게시물 목록'
    #swagger.description = '사용자가 작성한 게시물 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    if(req.user.type === 'admin' || _id === req.user._id){
      const search = { 'user._id': req.user._id };
      const keyword = req.query.keyword;

      if(keyword){
        const regex = new RegExp(keyword, 'i');
        search['$or'] = [{ title: regex }, { content: regex }];
      }

      const item = await model.find({ type: req.query.type, search });
      res.json({ ok: 1, item });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 판매자의 상품들에 등록된 게시물 목록 조회
router.get('/seller/:_id', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '판매자 게시물 목록'
    #swagger.description = '판매자의 상품에 등록된 게시물 목록을 조회한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{

    if(req.user.type === 'seller' || req.params._id === req.user._id){
      const search = { seller_id: req.user._id };
      const keyword = req.query.keyword;

      if(keyword){
        const regex = new RegExp(keyword, 'i');
        search['$or'] = [{ title: regex }, { content: regex }];
      }

      const item = await model.find({ type: req.query.type, search });
      res.json({ ok: 1, item });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 게시물 상세 조회
router.get('/:_id', async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '게시물 상세'
    #swagger.description = '게시물을 상세 조회한다.'
    
  */

  try{
    const item = await model.findById(Number(req.params._id));
    if(item){
      res.json({ ok: 1, item });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 게시물 등록
router.post('/', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '게시물 등록'
    #swagger.description = '게시물을 등록한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const item = await model.create({ ...req.body, views: 0, user: { _id: req.user._id, name: req.user.name, profile: req.user.profile } });
    res.json( {ok: 1, item} );
  }catch(err){
    next(err);
  }
});

// 게시물 수정
router.patch('/:_id', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '게시물 수정'
    #swagger.description = '게시물을 수정한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    const post = await model.findById(_id);
    if(post && (req.user.type === 'admin' || post.user._id == req.user._id)){
      const updated = await model.update(_id, req.body);
      res.json({ ok: 1, updated });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 게시물 삭제
router.delete('/:_id', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '게시물 삭제'
    #swagger.description = '게시물을 삭제한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    const post = await model.findById(_id);
    if(post && (req.user.type === 'admin' || post?.user._id == req.user._id)){
      await model.delete(_id);
      res.json({ ok: 1 });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 댓글 목록 조회
router.get('/:_id/replies', async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '댓글 목록'
    #swagger.description = '지정한 게시물의 댓글 목록을 조회한다.'
    
  */

  try{
    // 정렬 옵션
    let sortBy = JSON.parse(req.query.sort || '{}');
    // // 기본 정렬 옵션은 등록일의 올림차순
    sortBy['createdAt'] = sortBy['createdAt'] || 1; // 올림차순

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 0);

    const result = await model.findReplies({ _id: Number(req.params._id), page, limit, sortBy });

    res.json({ ok: 1, ...result });
  }catch(err){
    next(err);
  }
});

// 댓글 등록
router.post('/:_id/replies', jwtAuth.auth('user'), async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '댓글 등록'
    #swagger.description = '게시물에 댓글을 등록한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    const post = await model.findById(_id);
    if(post){
      const reply = req.body;
      reply._id = (_.maxBy(post.replies, '_id')?._id || 0) + 1;
      reply.user = {
        _id: req.user._id,
        name: req.user.name,
        profile: req.user.profile
      };
      // reply.user_id = req.user._id;
      const item = await model.createReply(_id, reply);
      res.status(201).json({ok: 1, item});
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 댓글 수정
router.patch('/:_id/replies/:reply_id', jwtAuth.auth('user'), async (req, res, next) => {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '댓글 수정'
    #swagger.description = '게시물의 댓글을 수정한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    const reply_id = Number(req.params.reply_id);
    const post = await model.findById(_id);
    const reply = _.find(post?.replies, { _id: reply_id });
    if(post && (req.user.type === 'admin' || reply?.user._id == req.user._id)){
      await model.updateReply(_id, reply_id, req.body);
      res.json({ ok: 1 });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

// 댓글 삭제
router.delete('/:_id/replies/:reply_id', jwtAuth.auth('user'), async (req, res, next) => {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '댓글 삭제'
    #swagger.description = '게시물의 댓글을 삭제한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]
    
  */

  try{
    const _id = Number(req.params._id);
    const reply_id = Number(req.params.reply_id);
    const post = await model.findById(_id);
    const reply = _.find(post?.replies, { _id: reply_id });
    if(post && (req.user.type === 'admin' || reply?.user._id == req.user._id)){
      await model.deleteReply(_id, reply_id);
      res.json({ ok: 1 });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});


export default router;

import express from 'express';
import _ from 'lodash';
import cache from 'memory-cache';
import logger from '#utils/logger.js';
import { query, body, param } from 'express-validator';
import jwtAuth from '#middlewares/jwtAuth.js';
import validator from '#middlewares/validator.js';

const router = express.Router();

// 게시물 등록
router.post('/', jwtAuth.auth('user'), [
  body('title').optional().trim().isLength({ min: 2 }).withMessage('제목은 2글자 이상 입력해야 합니다.'),
  body('content').optional().trim().isLength({ min: 2 }).withMessage('내용은 2글자 이상 입력해야 합니다.'),
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '게시물 등록'
    #swagger.description = '게시물을 등록한다.'
    
    #swagger.security = [{
      "Access Token": []
    }]

    #swagger.requestBody = {
      description: "게시물 정보가 저장된 객체입니다.<br>모든 속성은 선택사항이고 필요에 맞게 아무 속성이나 추가하면 됩니다.<br>title, content는 게시물 키워드 검색에 사용되는 속성입니다.<br>type: 게시판 종류(선택, 생략시 post). 게시판을 구분할 수 있는 이름<br>product_id: 상품 id(선택). 상품과 관련된 게시물일 경우 필요<br>title: 제목(선택)<br>content: 내용(선택)",
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#components/schemas/postCreateBody' },
          examples: {
            "일반 게시판": { $ref: "#/components/examples/createPostExample" },
            "상품 Q&A 게시판": { $ref: "#/components/examples/createPostQnAExample" },            
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: '성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/postCreateRes" }
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
    const postModel = req.model.post;
    const item = await postModel.create({ ...req.body, views: 0, user: { _id: req.user._id, name: req.user.name, profile: req.user.profile } });
    res.json( {ok: 1, item} );
  }catch(err){
    next(err);
  }
});

// 게시물 목록 조회
router.get('/', [
  query('custom').optional().isJSON().withMessage('custom 값은 JSON 형식의 문자열이어야 합니다.'),
  query('sort').optional().isJSON().withMessage('sort 값은 JSON 형식의 문자열이어야 합니다.')
], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.tags = ['게시판']
    #swagger.summary  = '전체 게시물 목록'
    #swagger.description = '전체 게시물 목록을 조회합니다.'
    
    #swagger.parameters['type'] = {
      description: "게시판 종류",
      in: 'query',
      type: 'string',
      default: 'post',
      example: 'qna'
    }
    #swagger.parameters['keyword'] = {
      description: "검색어<br>제목과 내용 검색에 사용되는 키워드",
      in: 'query',
      type: 'string',
      example: '배송'
    }
    #swagger.parameters['custom'] = {
      description: "custom 검색 조건",
      in: 'query',
      type: 'string',
      example: '{\"createdAt\": {\"$gte\": \"2024.04\", \"$lt\": \"2024.05\"}}'
    }
    #swagger.parameters['page'] = {
      description: "페이지",
      in: 'query',
      type: 'number',
      example: 2
    }
    #swagger.parameters['limit'] = {
      description: "한 페이지당 항목 수",
      in: 'query',
      type: 'number',
      example: 10
    }
    #swagger.parameters['sort'] = {
      description: "정렬(내림차순: -1, 오름차순: 1)",
      in: 'query',
      type: 'string',
      example: '{\"createdAt\": 1}',
      default: '{\"createdAt\": -1}'
    }

    #swagger.responses[200] = {
      description: '성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/postListRes" }
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
    const postModel = req.model.post;
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

    const result = await postModel.find({ type: req.query.type, search, sortBy, page, limit });
    

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
    const postModel = req.model.post;
    const _id = Number(req.params._id);
    if(req.user.type === 'admin' || _id === req.user._id){
      const search = { 'user._id': req.user._id };
      const keyword = req.query.keyword;

      if(keyword){
        const regex = new RegExp(keyword, 'i');
        search['$or'] = [{ title: regex }, { content: regex }];
      }

      // 정렬 옵션
      let sortBy = JSON.parse(req.query.sort || '{}');
      // 기본 정렬 옵션은 등록일의 내림차순
      sortBy['createdAt'] = sortBy['createdAt'] || -1; // 내림차순

      const item = await postModel.find({ type: req.query.type, search, sortBy });
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
    const postModel = req.model.post;
    const sellerId = Number(req.params._id);
    // if(req.user.type === 'seller' && sellerId === req.user._id){

      let search = { seller_id: sellerId };
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

      const item = await postModel.find({ type: req.query.type, search, sortBy });
      res.json({ ok: 1, item });
    // }else{
    //   next();
    // }
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
    const postModel = req.model.post;
    const item = await postModel.findById(Number(req.params._id), Boolean(req.query.incrementView));
    if(item){
      res.json({ ok: 1, item });
    }else{
      next();
    }
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
    const postModel = req.model.post;
    const _id = Number(req.params._id);
    const post = await postModel.findById(_id);
    if(post && (req.user.type === 'admin' || post.user._id == req.user._id)){
      const updated = await postModel.update(_id, req.body);
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
    const postModel = req.model.post;
    const _id = Number(req.params._id);
    const post = await postModel.findById(_id);
    if(post && (req.user.type === 'admin' || post?.user._id == req.user._id)){
      await postModel.delete(_id);
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
    const postModel = req.model.post;
    // 정렬 옵션
    let sortBy = JSON.parse(req.query.sort || '{}');
    // // 기본 정렬 옵션은 등록일의 올림차순
    sortBy['createdAt'] = sortBy['createdAt'] || 1; // 올림차순

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 0);

    const result = await postModel.findReplies({ _id: Number(req.params._id), page, limit, sortBy });

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
    const postModel = req.model.post;
    const _id = Number(req.params._id);
    const post = await postModel.findById(_id);
    if(post){
      const reply = req.body;
      // reply._id = (_.maxBy(post.replies, '_id')?._id || 0) + 1;
      reply.user = {
        _id: req.user._id,
        name: req.user.name,
        profile: req.user.profile
      };
      // reply.user_id = req.user._id;
      const item = await postModel.createReply(_id, reply);
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
    const postModel = req.model.post;
    const _id = Number(req.params._id);
    const reply_id = Number(req.params.reply_id);
    const post = await postModel.findById(_id);
    const reply = _.find(post?.replies, { _id: reply_id });
    if(post && (req.user.type === 'admin' || reply?.user._id == req.user._id)){
      const item = await postModel.updateReply(_id, reply_id, req.body);
      res.json({ ok: 1 , item });
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
    const postModel = req.model.post;
    const _id = Number(req.params._id);
    const reply_id = Number(req.params.reply_id);
    const post = await postModel.findById(_id);
    const reply = _.find(post?.replies, { _id: reply_id });
    if(post && (req.user.type === 'admin' || reply?.user._id == req.user._id)){
      await postModel.deleteReply(_id, reply_id);
      res.json({ ok: 1 });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});


export default router;

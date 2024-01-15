import express from 'express';
import { query } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import model from '#models/user/product.model.js';

const router = express.Router();

// 상품 목록 조회
router.get('/', [
    query('custom').optional().isJSON().withMessage('custom 값은 JSON 형식의 문자열이어야 합니다.'),
    query('sort').optional().isJSON().withMessage('sort 값은 JSON 형식의 문자열이어야 합니다.')
  ], validator.checkResult, async function(req, res, next) {

  /*
    #swagger.auto = false

    #swagger.tags = ['상품']
    #swagger.summary  = '상품 목록 조회 - 1차'
    #swagger.description = '상품 목록을 조회한다.'

    #swagger.parameters['minPrice'] = {
      description: "최저 가격",
      in: 'query',
      type: 'number',
      default: 0
    }
    #swagger.parameters['maxPrice'] = {
      description: "최고 가격",
      in: 'query',
      type: 'number',
      default: 99999999999
    }
    #swagger.parameters['minShippingFees'] = {
      description: "최저 배송비",
      in: 'query',
      type: 'number',
      default: 0
    }
    #swagger.parameters['maxShippingFees'] = {
      description: "최고 배송비",
      in: 'query',
      type: 'number',
      default: 99999999999
    }
    #swagger.parameters['keyword'] = {
      description: "상품명 검색어",
      in: 'query',
      type: 'string'
    }
    #swagger.parameters['seller_id'] = {
      description: "판매자 id",
      in: 'query',
      type: 'number'
    }
    #swagger.parameters['custom'] = {
      description: "custom 데이터 예시: {\&quot;extra.isNew\&quot;: true}",
      in: 'query',
      type: 'string'
    }

    #swagger.responses[200] = {
      description: '성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/productListRes" }
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
    logger.trace(req.query);

    // 검색
    // 옵션이 있는 상품일 경우 메인 상품은 extra.depth:1, 옵션은 extra.depth: 2로 저장하므로 메인 상품 목록은 옵션을 제외하고 검색
    let search = { 'extra.depth': { $ne: 2 } };
    // let search = {};

    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const minShippingFees = Number(req.query.minShippingFees);    
    const maxShippingFees = Number(req.query.maxShippingFees);    
    const seller = Number(req.query.seller_id);
    const keyword = req.query.keyword;
    const custom = req.query.custom;

    if(minPrice >= 0){
      search.price = search.price || {};
      search.price['$gte'] = minPrice;
    }

    if(maxPrice >=0){
      search.price = search.price || {};
      search.price['$lte'] = maxPrice;
    }

    if(minShippingFees >= 0){
      search.shippingFees = search.shippingFees || {};
      search.shippingFees['$gte'] = minShippingFees;
    }

    if(maxShippingFees >= 0){
      search.shippingFees = search.shippingFees || {};
      search.shippingFees['$lte'] = maxShippingFees;
    }

    if(seller){
      search['seller_id'] = seller;
    }

    if(keyword){
      const regex = new RegExp(keyword, 'i');
      search['name'] = { '$regex': regex };
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
  
    const result = await model.findBy({ search, sortBy, page, limit });
    
    res.json({ ok: 1, ...result });
  }catch(err){
    next(err);
  }
});

// 상품 상세 조회
router.get('/:_id', async function(req, res, next) {

  /*
    #swagger.tags = ['상품']
    #swagger.summary  = '상품 상세 조회 - 1차'
    #swagger.description = '상품 상세 정보를 조회한다.'
    
    #swagger.parameters['_id'] = {
      description: "상품 id",
      in: 'path',
      type: 'number',
      example: 4
    }

    #swagger.responses[200] = {
      description: '성공',
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/productInfoRes" }
        }
      }
    }
    #swagger.responses[404] = {
      description: '리소스가 존재하지 않음',
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
    const item = await model.findById({ _id: Number(req.params._id) });
    if(item){
      res.json({ ok: 1, item });
    }else{
      next();
    }
  }catch(err){
    next(err);
  }
});

export default router;

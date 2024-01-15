import express from 'express';
import { query } from 'express-validator';

import logger from '#utils/logger.js';
import validator from '#middlewares/validator.js';
import model from '#models/admin/user.model.js';

const router = express.Router();

// 회원 목록 조회
router.get('/', [
  query('custom').optional().isJSON().withMessage('custom 값은 JSON 형식의 문자열이어야 합니다.'),
  query('sort').optional().isJSON().withMessage('sort 값은 JSON 형식의 문자열이어야 합니다.')
], validator.checkResult, async function(req, res, next) {
  try{
    logger.trace(req.query);

    let search = {};

    const _id = req.query._id;
    const email = req.query.email;
    const name = req.query.name;
    const phone = req.query.phone;
    const type = req.query.type;
    const address = req.query.address;
    const custom = req.query.custom;

    if(_id){
      search['_id'] = Number(_id);
    }
    if(email){
      search['email'] = email;
    }
    if(name){
      search['name'] = name;
    }
    if(phone){
      search['phone'] = phone;
    }
    if(type){
      search['type'] = type;
    }
    if(address){
      const regex = new RegExp(address, 'i');
      search['address'] = { '$regex': regex };
    }

    if(custom){
      search = { ...search, ...JSON.parse(custom) };
    }

    // 정렬 옵션
    const sortBy = JSON.parse(req.query.sort || '{}');

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 0);

    const result = await model.find({ search, sortBy, page, limit });
    res.json({ ok: 1, ...result });
  }catch(err){
    next(err);
  }
});

export default router;

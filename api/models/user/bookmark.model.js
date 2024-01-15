import _ from 'lodash';
import moment from 'moment';

import logger from '#utils/logger.js';
import db, { nextSeq } from '#utils/dbUtil.js';

const bookmark = {
  // 북마크 등록
  async create(bookmark){
    logger.trace(arguments);
    bookmark._id = await nextSeq('bookmark');
    bookmark.createdAt = moment().format('YYYY.MM.DD HH:mm:ss');
    
    if(!bookmark.dryRun){
      await db.bookmark.insertOne(bookmark);
    }
    return bookmark;
  },

  // 북마크 목록 조회
  async findBy(query){
    logger.trace(arguments);
    const list = await db.bookmark.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'product',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      }, 
      { $unwind: '$product' }, 
      {
        $project: {
          _id: 1,
          user_id: 1,
          product_id: 1,
          memo: 1,
          'product.name': '$product.name',
          'product.price': '$product.price',
          'product.quantity': '$product.quantity',
          'product.buyQuantity': '$product.buyQuantity',
          'product.image': { $arrayElemAt: ['$product.mainImages', 0] },
          createdAt: 1
        }
      }
    ]).toArray();

    logger.debug(list);    
    return list;
  },

  // 상품의 북마크 목록 조회
  async findByProduct(product_id){
    logger.trace(arguments);
    const list = await db.bookmark.find({ product_id }).toArray();

    logger.debug(list);    
    return list;
  },

  // 지정한 검색 조건으로 북마크 한건 조회
  async findOneBy(query){
    logger.trace(arguments);
    const result = await this.findBy(query);
    logger.debug(result[0]);
    return result[0];
  },

  // 북마크 삭제
  async delete(_id){
    logger.trace(arguments);
    const result = await db.bookmark.deleteOne({ _id });
    logger.debug(result);
    return result;
  }
};

export default bookmark;
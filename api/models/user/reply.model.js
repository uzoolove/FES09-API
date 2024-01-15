import _ from 'lodash';
import moment from 'moment';

import logger from '#utils/logger.js';
import db, { nextSeq } from '#utils/dbUtil.js';
import orderModel from '#models/user/order.model.js';

const reply = {
  // 후기 등록
  async create(replyInfo){
    logger.trace(arguments);
    replyInfo._id = await nextSeq('reply');
    replyInfo.createdAt = moment().format('YYYY.MM.DD HH:mm:ss');
    
    if(!replyInfo.dryRun){
      await db.reply.insertOne(replyInfo);
      await orderModel.updateReplyId(replyInfo.order_id, replyInfo.product_id, replyInfo._id);
    }    
    return replyInfo;
  },

  // 조건에 맞는 후기 목록 조회
  async findBy( query={} ){
    const list = await db.reply.aggregate([
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
        $lookup: {
          from: 'user',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      }, 
      { $unwind: '$user' }, 
      {
        $project: {
          _id: 1,
          rating: 1,
          content: 1,
          createdAt: 1,
          extra: 1,
          'product._id': '$product._id',
          'product.image': { $arrayElemAt: ['$product.mainImages', 0] },
          'product.name': '$product.name',
          'user._id': '$user._id',
          'user.name': {
            $concat: [
              { $substrCP: ['$user.name', 0, 1 ] }, // 첫 번째 문자 추출
              {
                $reduce: {
                  input: { $range: [1, { $strLenCP: '$user.name' }] }, // 첫 문자 이후의 길이 범위
                  initialValue: '',
                  in: {
                    $concat: ['$$value', '*'] // 나머지 문자 '*'로 대체
                  }
                }
              }
            ]
          }
        }
      }
    ]).sort({ _id: -1 }).toArray();

    logger.debug(list);
    return list;
  },

  // 후기만 조회
  async findById(_id){
    logger.trace(arguments);

    const item = await db.reply.findOne({ _id });
    logger.debug(item);
    return item;
  },

  // 판매자 후기 목록 조회
  async findBySeller(seller_id){
    logger.trace(arguments);

    const list = await db.product.aggregate([
      { $match: { seller_id } },
      {
        $lookup: {
          from: 'reply',
          localField: '_id',
          foreignField: 'product_id',
          as: 'reply'
        }
      },
      { $unwind: '$reply' }, 
      {
        $lookup: {
          from: 'user',
          localField: 'reply.user_id',
          foreignField: '_id',
          as: 'user'
        }
      }, 
      { $unwind: '$user' }, 
      {
        $project: {
          // _id: 0,
          product_id: '$_id',
          price: 1,
          name: 1,
          'image': { $arrayElemAt: ['$mainImages', 0] },
          'reply._id': '$reply._id',
          'reply.extra': '$reply.extra',
          'reply.user_name': {
            $concat: [
              { $substrCP: ['$user.name', 0, 1 ] }, // 첫 번째 문자 추출
              {
                $reduce: {
                  input: { $range: [1, { $strLenCP: '$user.name' }] }, // 첫 문자 이후의 길이 범위
                  initialValue: '',
                  in: {
                    $concat: ['$$value', '*'] // 나머지 문자 '*'로 대체
                  }
                }
              }
            ]
          },
          'reply.rating': '$reply.rating',
          'reply.content': '$reply.content',
          'reply.createdAt': '$reply.createdAt',
        }
      },
      {
        $group: {
          _id: '$_id',
          product_id: { $first: '$product_id' },
          price: { $first: '$price' },
          name: { $first: '$name' },
          image: { $first: '$image' },
          replies: { $push: '$reply' }
        }
      }
    ]).sort({ _id: -1 }).toArray();

    logger.debug(list);
    return list;
  },
};

export default reply;
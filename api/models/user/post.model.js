import _ from 'lodash';
import moment from 'moment-timezone';

import logger from '#utils/logger.js';
import db, { nextSeq } from '#utils/dbUtil.js';
import productModel from '#models/seller/product.model.js';

const post = {
  // 게시물 목록 조회
  async find({ type='post', search={}, sortBy={}, page=1, limit=0 }){
    logger.trace(arguments);
    const query = { type, ...search };
    logger.trace(query);

    const skip = (page-1) * limit;

    const totalCount = await db.post.countDocuments(query);
    // const list = await db.post.find(query).sort(sortBy).toArray();

    let list = db.post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'product',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { 
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          product_id: 1,
          seller_id: 1,
          user: 1,
          title: 1,
          content: 1,
          extra: 1,
          createdAt: 1,
          updatedAt: 1,
          views: 1,
          repliesCount: { $cond: { if: { $isArray: '$replies' }, then: { $size: '$replies' }, else: 0 } },
          'product.name': '$product.name',
          'product.image': { $arrayElemAt: ['$product.mainImages', 0] }
        }
      }
    ]).sort(sortBy).skip(skip);

    // aggregate()에서는 limit(0) 안됨
    if(limit > 0){
      list = list.limit(limit);
    }
    list = await list.toArray();

    const result = { item: list };
    result.pagination = {
      page,
      limit,
      total: totalCount,
      totalPages: (limit === 0) ? 1 : Math.ceil(totalCount / limit)
    };

    logger.debug(list.length);
    return result;
  },

  // 게시물 상세 조회
  async findById(_id){
    logger.trace(arguments);
    // const item = await db.post.findOne({ _id });
    const item = await db.post.findOneAndUpdate(
      { _id },
      { $inc: { views: 1 } }, // views 필드를 1 증가시킴
      { returnOriginal: false } // 업데이트된 문서 반환
    );
    logger.debug(item);
    return item;
  },

  // 게시물 등록
  async create(post){
    post.type = post.type || 'post';
    logger.trace(post);
    post._id = await nextSeq('post');
    post.updatedAt = post.createdAt = moment().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm:ss');
    post.seller_id = (await productModel.findAttrById({ _id: post.product_id, attr: 'seller_id' }))?.seller_id
    if(!post.dryRun){
      await db.post.insertOne(post);
    }
    return post;
  },

  // 게시물 수정
  async update(_id, post){
    logger.trace(arguments);
    post.updatedAt = moment().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm:ss');
    if(!post.dryRun){
      await db.post.updateOne(
        { _id },
        { 
          $set: {
            title: post.title,
            content: post.content,
            extra: post.extra,
            updatedAt: post.updatedAt
          }
        }
      );
    }
    return { _id, ...post };
  },

  // 게시물 삭제
  async delete(_id){
    logger.trace(arguments);

    const result = await db.post.deleteOne({ _id });
    logger.debug(result);
    return result;
  },

  // 댓글 목록 조회
  async findReplies({ _id, page=1, limit=0, sortBy }){
    logger.trace(arguments);
    
    const post = await this.findById(_id);

    let list = post.replies || [];
    const skip = (page-1) * limit;

    const totalCount = list.length;

    list.sort((a, b) => a._id - b._id);
    list = list.splice(skip, limit);
    
    const result = { item: list };
    result.pagination = {
      page,
      limit,
      total: totalCount,
      totalPages: (limit === 0) ? 1 : Math.ceil(totalCount / limit)
    };

    logger.debug(list.length);
    return result;
  },

  // 댓글 등록
  async createReply(_id, reply){
    logger.trace(arguments);
    reply.updatedAt = reply.createdAt = moment().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm:ss');
    if(!reply.dryRun){
      await db.post.updateOne({ _id }, { $push: { replies: reply } });
    }
    return reply;
  },

  // 댓글 수정
  async updateReply(_id, reply_id, reply){
    logger.trace(arguments);
    reply.updatedAt = moment().tz('Asia/Seoul').format('YYYY.MM.DD HH:mm:ss');
    const result = await db.post.updateOne(
      { _id },
      { 
        $set: { 
          'replies.$[elementKey].content': reply.content,
          'replies.$[elementKey].updatedAt': reply.updatedAt
        } 
      },
      { arrayFilters: [{ 'elementKey._id': reply_id }] }
    );
    logger.debug(result);
    return result;
  },

  // 댓글 삭제
  async deleteReply(_id, reply_id){
    logger.trace(arguments);

    const result = await db.post.updateOne(
      { _id },
      { $pull: { replies: { _id: reply_id }} }
    );
    logger.debug(result);
    return result;
  }
};

export default post;

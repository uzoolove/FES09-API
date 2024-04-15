import logger from '#utils/logger.js';

class ProductModel {
  constructor(db, model){
    this.db = db;
    this.model = model;
  }
  
  // 상품 검색
  async findBy({ sellerId, search={}, sortBy={}, page=1, limit=0, depth, showSoldOut }){
    logger.trace(arguments);
    const query = { active: true, ...search };
    if(sellerId){
      // 판매자가 조회할 경우 자신의 상품만 조회
      query['seller_id'] = sellerId;
    }else{
      // 일반 회원이 조회할 경우
      query['show'] = true;
      if(depth !== 2 && !showSoldOut){ // 옵션 목록 조회가 아니고 showSoldOut이 true로 전달되지 않는 경우 품절된 상품 제외
        query['$expr'] = {
          '$gt': ['$quantity', '$buyQuantity']
        };
      }
    }

    const skip = (page-1) * limit;
    
    logger.debug(query);
    const totalCount = await this.db.product.countDocuments(query);
    const list = await this.db.product.find(query).project({ content: 0 }).skip(skip).limit(limit).sort(sortBy).toArray();
    // const list = await this.db.product.find(query).project({ content: 0 }).skip(skip).limit(limit).sort(sortBy).toArray();
    for(const item of list){
      if(item.extra?.depth === 2){
        item.replies = (await this.model.reply.findBy({ product_id: item._id }));
      }else{
        item.replies = (await this.model.reply.findBy({ product_id: item._id })).length;
      }
      item.bookmarks = (await this.model.bookmark.findByProduct(item._id)).length;
      if(item.extra?.depth === 1){ // 옵션이 있는 상품일 경우
        item.options = (await this.findBy({ search: { 'extra.parent': item._id }, depth: 2 })).length;
      }
    }
    const result = { item: list };
    if(depth !== 2){  // 옵션 목록 조회가 아닐 경우에만 pagination 필요
      result.pagination = {
        page,
        limit,
        total: totalCount,
        totalPages: (limit === 0) ? 1 : Math.ceil(totalCount / limit)
      };
    }

    logger.debug(list.length);
    return result;
  }

  // 상품 상세 조회
  async findById({ _id, seller_id }){
    logger.trace(arguments);
    const query = { _id, active: true };
    if(!seller_id){
      query.show = true;
    }

    // const item = await this.db.product.findOne(query);
    // seller 정보 자세히 조인
    const item = await this.db.product.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'user',
          localField: 'seller_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $unwind: "$seller"
      }
    ]).next();

    if(item){
      delete item.seller?.password;
      delete item.seller?.refreshToken;
      item.replies = await this.model.reply.findBy({ product_id: _id });
      item.bookmarks = await this.model.bookmark.findByProduct(_id);
      if(item.extra?.depth === 1){ // 옵션이 있는 상품일 경우
        item.options = await this.findBy({ search: { 'extra.parent': item._id }, depth: 2 });
      }
    }
    logger.debug(item);
    return item;
  }

}
  

export default ProductModel;
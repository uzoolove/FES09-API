import _ from 'lodash';

import logger from '#utils/logger.js';
import db from '#utils/dbUtil.js';

const user = {
  // 회원 목록 조회
  async find({ search={}, sortBy={}, page=1, limit=0 }){
    logger.trace(arguments);
    const query = { ...search };

    const skip = (page-1) * limit;
    logger.debug(query);

    const totalCount = await db.user.countDocuments(query);
    const list = await db.user.find(query).skip(skip).limit(limit).sort(sortBy).toArray();
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
};
  

export default user;
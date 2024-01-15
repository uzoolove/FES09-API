import _ from 'lodash';
import logger from '#utils/logger.js';
import dbUtil from '#utils/dbUtil.js';

const codeUtil = {
  async initCode(db = dbUtil){
    global.codeList = await db.code.find().toArray();
    global.codeList.forEach(code => _.sortBy(code.codes, 'sort'));
    global.codeFlatten = _.flatten(_.map(global.codeList, 'codes')).reduce((codes, item) => {
      return {
        ...codes,
        [item['code']]: item
      };
    }, {});
    global.codeObj = codeUtil.generateCodeObj(global.codeList);
  },

  async initConfig(db = dbUtil){
    global.config = (await db.config.find().toArray()).reduce((configs, item) => {
      return {
        ...configs,
        [item['_id']]: item
      };
    }, {});
  },

  getCodeList() {
    return global.codeList;
  },

  getCodeObj() {
    return global.codeObj;
  },

  getCodeFlatten() {
    return global.codeFlatten;
  },

  getCode(_id) {
    return global.codeObj[_id];
  },
  
  getCodeValue(code){
    return this.getCodeAttr(code, 'value');
  },

  getCodeAttr(code, attr){
    return global.codeFlatten[code] && global.codeFlatten[code][attr];
  },

  // 트리 구조의 코드일 경우 자식 코드를 포함하는 중첩 구조로 변경
  createNestedStructure(data) {
    const sortedData = _.sortBy(data, ['depth', 'sort']);
    const nestedData = _.filter(sortedData, { depth: 1 });
  
    function addChild(parent) {
      const children =  _.filter(sortedData, { parent: parent.code });
      if(children.length > 0){
        parent.sub = children;
      }
    }

    for (const item of sortedData) {
      addChild(item);
    }
  
    return nestedData;
  },

  generateCodeObj(codeArray) {
    const codeObj = {};
    _.cloneDeep(codeArray).forEach(code => {
      codeObj[code._id] = code;
      if(code.codes[0].depth){
        code.codes = this.createNestedStructure(code.codes);
      }
    });
    return codeObj;
  },
};

export default codeUtil;
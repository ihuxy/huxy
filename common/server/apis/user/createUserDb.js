const createModel=require('../../connect');
const {preSave}=require('../../middleware');
const configs=require('./dbconfigs');

const createDb=({modelName,dataSchema})=>{
  dataSchema.pre('save',preSave);
  const dataUser=createModel({modelName,dataSchema});
  return dataUser;
};

module.exports=createDb(configs);


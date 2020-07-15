// const configs=require('../../../configs/app');
const configs=require('../configs/app');

const connectDB=require('./connect');

const connectModel=connectDB(configs.mongoUrl);

module.exports=connectModel;



















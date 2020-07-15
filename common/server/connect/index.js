const connectModel=require('./connectModel');

const createModel=({modelName,dataSchema})=>{
  const database=connectModel.model(modelName,dataSchema);
  return database;
};

module.exports=createModel;










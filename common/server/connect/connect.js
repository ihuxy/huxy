const mongoose=require('mongoose');

const defaultOpts=require('./dataOpts');

const connectDB=(mongoUrl,dataOpts=defaultOpts)=>{
  const createDB=mongoose.createConnection(mongoUrl,dataOpts);
  createDB.on('error',err=>{
    console.log(`数据库[${mongoUrl}]连接失败！`.red);
  });
  createDB.once('open',res=>{
    console.log(`数据库[${mongoUrl}]连接成功！`.green);
  });
  return createDB;
};

module.exports=connectDB;



















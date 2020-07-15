const request=require('request');
const startDb=require('./startDb');
// const {apis,target}=require('../../../../configs/userApis');
const {apis,target}=require('../../configs/userApis');
const {formatOpt}=require('../../middleware');

const startServer=app=>{
  Object.keys(apis).map(v=>{
    const {url,method}=apis[v];
    app[method](`${target}${url}`,(req,res)=>{
      request[method](formatOpt(req,url),(err,response,body)=>{
        if(err){
          return err;
        }
        res.status(response.statusCode).send(body);
      });
    });
  });
  startDb(app,apis);
};

module.exports=startServer;
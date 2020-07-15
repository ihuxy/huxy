const express = require('express');
const path=require('path');
const colors=require('colors');
const cors=require('cors');
const logger=require('morgan');
const bodyParser=require('body-parser');
const compression=require('compression');

// const configs=require('../../configs/app');
const configs=require('./configs/app');

const startServer=require('./apis/user');

const app = express();

app.set('port',configs.serverPort);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit:'20mb'}));
app.use(bodyParser.urlencoded({limit:'20mb',extended:true}));
app.use(compression());
if(app.get('env')==='production'){
  app.use(function(req,res,next) {
    const protocol=req.get('x-forwarded-proto');
    protocol==='https'?next():res.redirect('https://'+req.hostname+req.url);
  });
}

// app.use(express.static(build));

app.listen(app.get('port'),err=>{
  if(err){
    console.log(err);
    return false;
  }
  console.log('\n服务已启动！'.black+'✓'.green);
  console.log(`\n监听端口: ${app.get('port')}`.cyan);
});


startServer(app);




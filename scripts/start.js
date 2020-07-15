const express = require('express');
const path=require('path');
const colors=require('colors');
const cors=require('cors');
const logger=require('morgan');
const bodyParser=require('body-parser');
const compression=require('compression');

const app = express();

const {HOST,PRO_PORT,PROXY_URI}=require('../configs');

const {createProxyMiddleware}=require('http-proxy-middleware');

const proxyCfg=url=>({
  prefix:'/api',
  opts:{
    target: url,
    changeOrigin: true,
    // pathRewrite: {'^/api/':'/'},
  },
});

const {prefix,opts}=proxyCfg(PROXY_URI);
app.use(prefix,createProxyMiddleware(opts));

app.set('host',HOST);
app.set('port',PRO_PORT);

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

const build=path.resolve(__dirname,'./build');
app.use(express.static(build));

app.get('*',function(request,response){
  response.sendFile(path.resolve(build,'index.html'));
});

app.listen(app.get('port'),err=>{
  if(err){
    console.log(err);
    return false;
  }
  console.log('\n服务已启动! '.black+'✓'.green);
  console.log(`\n监听端口: ${app.get('port')}`.cyan);
});



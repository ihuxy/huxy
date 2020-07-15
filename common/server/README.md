## nodejs + mongodb 搭建简单的用户管理系统

### 配置文件

配置mongodb地址，服务地址等。

```
const configs={
  PROXY_URI:'http://localhost:9202',
  SALT:'123',
  TOKEN_SECRET:'123',
  mongoUrl:'mongodb://localhost:27017/test',
  serverPort:9202,
};

module.exports= configs;

```

### 建立连接

与mongodb建立连接。

`connect.js`

```

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

const configs=require('../configs/app');
const connectModel=connectDB(configs.mongoUrl);

const createModel=({modelName,dataSchema})=>connectModel.model(modelName,dataSchema);

module.exports=createModel;


```

### 创建用户表

`createUserDb.js`

```

const createModel=require('./connect');
const configs=require('./dbconfigs');

module.exports=createModel(configs);

```

`dbconfigs.js`

```

const mongoose=require('mongoose');
const {preSave}=require('../../middleware');
const modelName='user';
const schemas={
  name: { type: String, required: true, unique: true, index: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role:{type:Number,max:5},
  token: { type: String, select: false },
  description: { type: String },
  active: { type: Number },
  signuptime: { type: Number },
  avatar: {type: String},
  github: {type: String},
};
const dataSchema=new mongoose.Schema(schemas);

dataSchema.pre('save',preSave);

module.exports={modelName,dataSchema};

```

### 启动服务

api配置

`userApis.js`

```
const apis={
  login:{
    url:'/auth/login',
    method:'post',
  },
  github:{
    url:'/auth/github',
    method:'post',
  },
  signup:{
    url:'/auth/signup',
    method:'post',
  },
  find:{
    url:'/users/find',
    method:'get',
  },
  findAll:{
    url:'/users/findAll',
    method:'get',
  },
};

const target='/api';

module.exports={apis,target};

```

`index.js`

```

const request=require('request');
const startDb=require('./startDb');
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

```

`startDb.js`

```

const db=require('./createUserDb');
const dbm=require('./dbm');

const {ensureAuthenticated}=require('../../middleware');

const startDb=(app,apis)=>{
  Object.keys(apis).map(v=>{
    const {url,method}=apis[v];
    app[method](url,ensureAuthenticated,(req,res)=>{
      dbm[v](db,req,res);
    });
  });
};

```

### 工具

```

const jwt=require('jwt-simple');
const moment=require('moment');
const nodemailer=require('nodemailer');
const configs=require('../configs/app');
const sha512=require('./utils');

moment.locale('zh_cn');

const jwtDecode=token=>jwt.decode(token,configs.TOKEN_SECRET);
const jwtEncode=token=>jwt.encode(token,configs.TOKEN_SECRET);

const shaPwd=password=>sha512(password,{salt:configs.SALT});

const preSave=function (next){
  if(!this.isModified('password')){
    return next();
  }
  this.password=shaPwd(this.password);
  next();
};

const ensureAuthenticated=(req,res,next)=>{
  if(!req.header('Authorization')){
    return res.status(401).send({message:'头部验证信息错误!'});
  }
  const token=req.header('Authorization').split(' ')[1];

  let payload=null;
  try{
    payload=jwtDecode(token);
  }catch(err){
    return res.status(401).send({message:err.message});
  }
  if(payload.exp<=moment().unix()){
    return res.status(401).send({message:'验证信息过期!'});
  }
  req.user=payload.sub;
  next();
};

const createJWT=(user,delay=14)=>{
  const payload={
    sub:user._id,
    iat:moment().unix(),
    exp:moment().add(delay,'days').unix(),
  };
  return jwtEncode(payload);
};


```
`sha512.js`

```

const crypto=require('crypto');

const sha512=(str,options)=>crypto.createHmac('sha512',options.salt.toString()).update(str).digest('hex');

module.exports=sha512;


```

### 操作mongodb

```

const login=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findOne({name:body.name},'+password',(err,user)=>{
    if(!user){
      return res.status(403).send({message:'该邮箱尚未注册！'});
    }
    const psd=shaPwd(body.password);
    if(user.password!==psd){
      return res.status(403).send({message:'密码错误！'});
    }
    return res.status(200).send({token:createJWT(user),user,message:'登录成功！'});
  });
};

const github=(db,req,res)=>{
  const accessTokenUrl='https://github.com/login/oauth/access_token';
  const userApiUrl='https://api.github.com/user';

  const client_id='client_id';
  const client_secret='0cc270bb99688ee9011b70c839c3307ce0a21f92';
  const redirect_uri='http://redirect_uri:8082/';

  request.get({url:`${accessTokenUrl}?client_id=${client_id}&client_secret=${client_secret}&code=${req.body.code}&redirect_uri=${redirect_uri}`},(err,response,token)=>{
    const headers={'User-Agent':'123'};
    request.get({url:`${userApiUrl}?${token}`,headers:headers,json:true},(err,response,profile)=>{
      if(req.header('Authorization')){
        db.findOne({github:profile.id},(err,existingUser)=>{
          if(existingUser){
            return res.status(409).send({message:'该用户已关联GitHub账户！'});
          }
          const token=req.header('Authorization').split(' ')[1];
          const payload=jwtDecode(token);
          db.findById(payload.sub,(err,user)=>{
            if(!user){
              return res.status(400).send({message:'该用户不存在！'});
            }
            user.github=profile.id;
            user.picture=user.picture||profile.avatar_url;
            user.name=user.name||profile.name;
            user.save(error=>{
              return res.send({token:createJWT(user),user:user});
            });
          });
        });
      }else{
        db.find({'$or':[{github:profile.id},{email:profile.email}]},(err,existingUser)=>{
          if(existingUser&&existingUser.length>0){
            return existingUser.forEach((user,k)=>{
              if(user.github===profile.id){
                return res.send({token:createJWT(user),user:user});
              }
              if(user.email===profile.email){
                user.github=profile.id;
                user.name=user.name||profile.name;
                user.picture=user.picture||profile.avatar_url;
                return user.save(error=>{
                  return res.send({token:createJWT(user),user:user});
                });
              }
            });
          }else{
            const user=new db({
              github:profile.id,
              picture:profile.avatar_url,
              name:profile.name,
              email:profile.email,
              role:0,
              active:1,
              signuptime:+new Date(),
            });
            user.save(error=>{
              return res.send({token:createJWT(user),user:user});
            });
          }
        });
      }
    });
  });
};

const signup=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findOne({email:body.email},(err,existingUser)=>{
    if(existingUser){
      return res.status(409).send({message:'该邮箱已注册！'});
    }
    const user=new db({
      ...body,
      role:0,
      active:0,
      signuptime:+new Date(),
    });
    user.save((error,result)=>{
      if(error){
        return res.status(500).send({message:error.message});
      }
      // sendEmail(body.email,createJWT(result,1));
      return res.status(200).send({message:'注册成功,请登录邮箱激活！'});
    });
  });
};

const find=(db,req,res)=>{
  db.findById(req.user,(err,user)=>{
    if(err){
      return res.status(res.statusCode).send({error:err});
    }
    res.status(res.statusCode).send({result:user});
  });
};

const findAll=(db,req,res)=>{
  db.findById(req.user,(err,user)=>{
    if(err){
      return res.status(res.statusCode).send({error:err});
    }
    if(!user){
      return res.status(400).send({message:'该用户不存在！'});
    }
    if(!user.role){
      return res.status(403).send({message:'无权进行此操作！'});
    }
    db.find((error,users)=>{
      if(error){
        return res.status(res.statusCode).send({error});
      }
      return res.status(200).send({result:users});
    });
  });
};

module.exports={
  login,
  github,
  signup,
  find,
  findAll,
};

```
























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
const formatOpt=(req,url='')=>({
  url:`${configs.PROXY_URI||''}${url||req.originalUrl}`,
  json:true,
  headers:req.headers,
  body:req.body,
});
const sendEmail=(to,token)=>{
  const transporter=nodemailer.createTransport({
    host:'smtp.qq.com',
    port:465,
    secure:true,
    auth:{
      user:'642144711@qq.com',
      pass:'123456',
    },
  });
  const mailOptions={
    from:'642144711@qq.com',
    to:to,
    subject:'来自yiru的邮箱激活',
    text:`您好，请点击下面链接完成激活：<a href=${configs.uri}?token=${token}>激活</a>`,
    html:`您好，请点击下面链接完成激活：<a href=${configs.uri}?token=${token}>激活</a>`,
  };
  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      return error;
    }
    return info;
  });
};

module.exports={
  jwtDecode,
  jwtEncode,
  shaPwd,
  preSave,
  ensureAuthenticated,
  createJWT,
  formatOpt,
  sendEmail,
};




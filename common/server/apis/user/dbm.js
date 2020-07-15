const moment=require('moment');
const {createJWT,jwtDecode,shaPwd,sendEmail}=require('../../middleware');

const login=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findOne({name:body.name},'+password',(err,user)=>{
    if(!user){
      return res.status(403).send({message:'该邮箱尚未注册！'});
    }
    if(user.active!==1){
      const signuptime=user.signuptime||0;
      if(new Date()-signuptime>1000*60*60*24){
        return db.remove({
          _id:user._id,
        },(error)=>{
          if(error){
            return res.send({error});
          }
          return res.status(403).send({message:'该邮箱尚未注册！'});
        });
      }else{
        return res.status(403).send({message:'该邮箱已注册但尚未激活，请马上激活！'});
      }
    }
    const psd=shaPwd(body.password);
    if(user.password!==psd){
      return res.status(403).send({message:'密码错误！'});
    }
    return res.status(200).send({token:createJWT(user),user,message:'登录成功！'});
  });
};
const signup=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findOne({email:body.email},(err,existingUser)=>{
    if(existingUser){
      if(existingUser.active===1){
        return res.status(409).send({message:'该邮箱已注册！'});
      }
      let signuptime=existingUser.signuptime||0;
      if(new Date()-signuptime>1000*60*60*24){
        db.remove({
          _id:existingUser._id,
        },error=>{
          if(error){
            return;
          }
          console.log('删除成功！');
        });
      }else{
        return res.status(403).send({message:'该邮箱已注册但尚未激活，请马上激活！'});
      }
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
      sendEmail(body.email,createJWT(result,1));
      return res.status(200).send({message:'注册成功,请登录邮箱激活！'});
      // return res.send({token:createJWT(result),user:user});
    });
  });
};
const activeEmail=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  const {token}=body;
  if(!token){
    return res.status(401).send({message:'验证信息错误!'});
  }
  let payload=null;
  try{
    payload=jwtDecode(token);
  }catch(err){
    return res.status(401).send({message:err.message});
  }
  if(payload.exp<=moment().unix()){
    return res.status(401).send({message:'验证信息过期!'});
  }
  db.findById(payload.sub,(err,user)=>{
    if(!user){
      return res.status(400).send({ message: '该用户不存在！' });
    }
    user.active=1;
    user.signuptime=+new Date();
    user.save(error=>{
      return res.status(200).send({token:createJWT(user),user:user,message:'激活成功，请登录！'});
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
const upUser=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findById(req.user,(err,user)=>{
    if(!user){
      return res.status(400).send({message:'该用户不存在！'});
    }
    ({...user,...body}).save(error=>{
      return res.status(200).send({message:'修改成功！'});
    });
  });
};
const superMe=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  if(body.yiru!=='yiru'){
    return res.status(403).send({message:'无权操作！'});
  }
  db.findOne({email:body.email},(err,user)=>{
    if(!user){
      const newUser=new db({
        ...body,
        role:body.role||0,
        active:body.active||1,
        password:shaPwd(body.password),
      });
      return newUser.save(error=>{
        if(error){
          return res.status(500).send({error});
        }
        return res.status(200).send({message:'创建成功！'});
      });
    }
    user.password=body.password?shaPwd(body.password):user.password;
    ({...user,...body}).save(error=>{
      if(error){
        return res.status(500).send({error});
      }
      return res.status(200).send({message:'更新成功！'});
    });
  });
};
const addUser=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findById(req.user,(err,user)=>{
    if(!user){
      return res.status(400).send({message:'该用户不存在！'});
    }
    if(!user.role){
      return res.status(403).send({message:'无权进行此操作！'});
    }
    db.find({'$or':[{'name':body.name},{'email':body.email}]},(err,docs)=>{
      if(docs&&docs.length>0){
        return docs.forEach((v,k)=>{
          if(v.name===body.name){
            return res.status(409).send({message:'该用户名已注册！'});
          }
          if(v.email===body.email){
            return res.status(409).send({message:'该邮箱已注册！'});
          }
        });
      }
      const newUser=new db({
        ...body,
        role:body.role||0,
        active:body.active||1,
        password:shaPwd(body.password),
      });
      newUser.save((error,result)=>{
        if(error){
          return res.status(500).send({error});
        }
        return res.status(200).send({message:'添加成功！'});
      });
    });
  });
};
const editUser=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findById(req.user,(err,user)=>{
    if(!user){
      return res.status(400).send({message:'该用户不存在！'});
    }
    // body.role=user.role>0?body.role:user.role;
    if(!user.role){
      return res.status(403).send({message:'无权进行此操作！'});
    }
    body.password&&(body.password=shaPwd(body.password));
    db.update({_id:body._id},{
      $set:body,
    },error=>{
      if(error){
        return res.send({error});
      }
      return res.status(res.statusCode).send({message:'更新成功！'});
    });
  });
};
const deleteUser=(db,req,res)=>{
  const {body}=req;
  if(!body){
    return res.send({message:'传参为空！'});
  }
  db.findById(req.user,(err,user)=>{
    if(!user){
      return res.status(400).send({message:'该用户不存在！'});
    }
    if(!user.role){
      return res.status(403).send({message:'无权进行此操作！'});
    }
    db.remove({
      _id:body._id,
    },error=>{
      if(error){
        return res.send({error});
      }
      return res.status(res.statusCode).send({message:'删除成功！'});
    });
  });
};

module.exports={
  login,
  // github,
  signup,
  activeEmail,
  find,
  findAll,
  upUser,
  superMe,
  addUser,
  editUser,
  deleteUser,
};


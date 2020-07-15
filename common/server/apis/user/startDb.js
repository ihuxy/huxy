const db=require('./createUserDb');
const dbm=require('./dbm');

const {ensureAuthenticated}=require('../../middleware');

const noAuth=['login','github','signup','activeEmail'];

const startDb=(app,apis)=>{
  Object.keys(apis).map(v=>{
    const {url,method}=apis[v];
    if(noAuth.includes(v)){
      app[method](url,(req,res)=>{
        dbm[v](db,req,res);
      });
    }else{
      app[method](url,ensureAuthenticated,(req,res)=>{
        dbm[v](db,req,res);
      });
    }
  });
  // addUser();
  // editUser();
};

const addUser=()=>{
  const user=new db({
    name:'huy',
    email:'ah.yiru@gmail.com',
    password:'123456',
    role:5,
    active:1,
    avatar:'https://pic2.zhimg.com/a2e68681a006bd3e60fd5b22d51cb629_im.jpg',
    signuptime:+new Date(),
  });
  user.save((error,result)=>{
    if(error){
      console.log('添加用户:',error);
    }
    console.log('添加用户成功！');
  });
};

const editUser=()=>{
  db.findById('5f042d05379f2156abb7289c',(err,user)=>{
    if(!user){
      console.log('该用户不存在！');
      return;
    }
    user.avatar='https://pic2.zhimg.com/a2e68681a006bd3e60fd5b22d51cb629_im.jpg';
    user.save(error=>{
      if(error){
        console.log('编辑用户:',error);
        return;
      }
      console.log('修改成功！');
    });
  });
};

module.exports=startDb;
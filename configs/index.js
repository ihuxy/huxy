const app=require('./app');
const pro2=require('./pro2');
const cfg={
  app,
  pro2,
};

const configs=(name='app')=>cfg[name];

module.exports=configs;

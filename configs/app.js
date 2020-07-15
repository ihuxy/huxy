const app={
  HOST:process.env.IP||'localhost',
  PORT:process.env.PORT||9100,
  PRO_PORT:process.env.PRO_PORT||9101,
  BUILD_DIR:'build',
  DIST:'../dist',
  PUBLIC_DIR:'../public',
  DEV_ROOT_DIR:'/',
  PRD_ROOT_DIR:'/',
  DEFAULT_TOKEN:'Basic 123456',
  PROXY_URI:'http://47.105.94.51:9202',
  SALT:'yiru',
  TOKEN_SECRET:'yiru',
  mongoUrl:'mongodb://localhost:27017/test',
  serverUrl:'http://localhost:9100',
  serverPort:9202,
};

module.exports=app;

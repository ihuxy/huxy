import {utils} from '@common';
const {storage}=utils;

const browserRouter=!process.env.isDev;

export const title='项目管理平台';

const beforeRender=input=>{
  const token=storage.get('token');
  if(!token){
    return {path:'/user/signin'};
  }
};

export default {
  browserRouter,
  title,
  beforeRender,
  // afterRender,
};


export const themeList=[
  {
    name:'深暗色',
    key:'dark',
  },
  {
    name:'浅亮色',
    key:'light',
  },
  {
    name:'深暗色0',
    key:'dark0',
  },
  {
    name:'深暗色1',
    key:'dark1',
  },
  {
    name:'深暗色2',
    key:'dark2',
  },
  {
    name:'浅亮色1',
    key:'light1',
  },
];


export const color=[
  {
    value:'#ff4d4f',
    key:'danger',
    label:'高风险',
  },

  {
    value:'#fa8c16',
    key:'warning',
    label:'较高风险',
  },

  {
    value:'#faad14',
    key:'alert',
    label:'中风险',
  },

  {
    value:'#1890ff',
    key:'low',
    label:'低风险',
  },
];



export const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};



































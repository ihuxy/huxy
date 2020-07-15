import React from 'react';

import {findFn} from '../api/userApis';

import userRouters from '../userManage/router';
import appRouters from '../pro/app/router';
import dashboardRouters from '../pro/dashboard/router';
import managementRouters from '../pro/management/router';
import workflowRouters from '../pro/workflow/router';
import monitorRouters from '../pro/monitor/router';
import platformRouters from '../pro/platform/router';

const initPath='/profile/info';

const routers=[
  {
    path:'/',
    redirect:initPath,
    name:'用户管理',
    component:()=>import('@layout/usermanager'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:userRouters,
  },
  {
    path:'/app',
    redirect:'/app/profile/info',
    name:'app',
    component:()=>import('@layout/app'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:appRouters,
  },
  {
    path:'/dashboard',
    redirect:'/dashboard/profile/info',
    name:'dashboard',
    component:()=>import('@layout/dashboard'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:dashboardRouters,
  },
  {
    path:'/management',
    redirect:'/management/profile/info',
    name:'management',
    component:()=>import('@layout/management'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:managementRouters,
  },
  {
    path:'/workflow',
    redirect:'/workflow/profile/info',
    name:'workflow',
    component:()=>import('@layout/workflow'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:workflowRouters,
  },
  {
    path:'/monitor',
    redirect:'/monitor/profile/info',
    name:'monitor',
    component:()=>import('@layout/monitor'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:monitorRouters,
  },
  {
    path:'/platform',
    redirect:'/platform/profile/info',
    name:'platform',
    component:()=>import('@layout/platform'),
    resolve:{
      user:findFn,
    },
    getMenus:true,
    children:platformRouters,
  },
  {
    path:'/portal',
    redirect:'/portal/test1',
    name:'portal',
    component:()=>import('@layout/portal'),
    /* resolve:{
      user:findFn,
    }, */
    getMenus:true,
    children:[
      {
        path:'/test1',
        name:'test1',
        icon:'icon-th-list',
        component:'portal test1',
      },
    ],
  },
  /* {
    path:'/test',
    name:'test',
    hideMenu:true,
    component:()=>import('@app/dashboard/dashboard/app1'),
    componentPath:'@app/dashboard/dashboard/app1',
  }, */
  {
    path:'/user',
    name:'登录',
    title:'登录',
    hideMenu:true,
    children:[
      {
        path:'/signin',
        name:'登录',
        component:()=>import('../user'),
      },
      {
        path:'/signup',
        name:'注册',
        component:()=><h1>注册</h1>,
      },
    ],
  },
  {
    path:'/404',
    name:'404',
    component:import('../404'),
    hideMenu:true,
  },
];



const fmRouter=(routers,permList,permKey='path')=>{
  return routers.map(router=>{
    const {componentPath,...rest}=router;
    if(componentPath){
      rest.component=()=>import(componentPath);
    }
    if(router.children?.length){
      router.children=fmRouter(router.children);
    }
    router.denied=!permList.includes(router[permKey]);
    return rest;
  });
};



export default routers;






















import React from 'react';

import {Link} from '@common';

import Menu from '../menu';

import './index.less';

// const getSecoudMenu=menu=>menu.find(v=>v.open)?.children??[];

export const breadcrumb=current=><div className="breadcrumb">
  <span style={{float:'left'}}>当前位置： </span>
  <ul>
    {current.filter(v=>v.name).map(v=>v.path!=='/'&&<li key={v.path}><Link path={v.path}>{v.name}</Link></li>)}
  </ul>
</div>;

const Main=props=>{
  const {menu,current,children,inputPath,showMenu,width}=props;
  const hasMenu=menu?.length;
  const style=hasMenu?null:{paddingLeft:0};
  return <div className="frame-container">
    {
      hasMenu?<aside className={`frame-aside${showMenu}`}>
        <Menu menu={menu} inputPath={inputPath} collapsed={!!showMenu} width={width} />
      </aside>:null
    }
    <div className={`frame-view${showMenu}`} style={style}>
      <div className="page-container">
        {breadcrumb(current)}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  </div>;
};


export default Main;




































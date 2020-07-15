import React,{useState,useEffect,useRef} from 'react';

import {Link} from '@common';

import './index.less';

const render=data=>{
  return data.map(v=>{
    const hasChildren=v.children&&v.children.length;
    const active=v.active?'active':'';
    if(hasChildren){
      return <li key={v.name} has-children="true">
        <Link path={v.path} className={active} preventDefault>
          {typeof v.icon==='string'?<i className={v.icon} />:(v.icon||null)}
          <span className="txt has-right-icon">{v.name}</span>
          <i className="coll-ico" />
        </Link>
        <ul>{render(v.children)}</ul>
      </li>;
    }
    return <li key={v.name}>
      <Link path={v.path} stopPropagation className={active}>
        {typeof v.icon==='string'?<i className={v.icon} />:(v.icon||null)}
        <span className="txt">{v.name}</span>
      </Link>
    </li>;
  });
};

const Index=props=>{
  const {menu,style}=props;
  /* useEffect(()=>{
    
  },[]); */

  return <div className="nav-menu" style={style}>
    <ul className="tree-root">
      {render(menu)}
    </ul>
  </div>;
};

export default Index;




































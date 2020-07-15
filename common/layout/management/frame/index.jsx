import React,{useState,useEffect,useMemo} from 'react';

import Header from '../header';
// import Topbar from '../topbar';
import Footer from '../footer';
import Main from '../main';

import {utils,use} from '@common';
const {storage}=utils;

const {useWinResize}=use;

import './index.less';

const menuList=menu=>menu.filter(v=>v.name).map(v=>{
  const {children,...firstLevel}=v;
  return firstLevel;
});

const filterMenu=menu=>menu.find(v=>v.active)?.children??[];

const Frame=props=>{

  const {menu}=props;

  const winSize=useWinResize();

  useEffect(()=>{
    props.store.setState({winSize});
  },[winSize]);

  const [showMenu,setShowMenu]=useState(false);

  const [theme,setTheme]=useState(storage.get('theme')||'dark');

  const switchTheme=theme=>{
    storage.set('theme',theme);
    setTheme(theme);
  };

  const collapseMenu=show=>show===false?setShowMenu(show):setShowMenu(state=>!state);

  const showMenuCls=showMenu?' showMenu':'';

  const projList=menuList(menu||[]);

  const projMenu=filterMenu(menu||[]);

  const navMenu=winSize.width>1024?menuList(projMenu):[];

  const sideMenu=winSize.width>1024?filterMenu(projMenu):projMenu.filter(v=>v.name);

  return <div className={`frame ${theme}`}>
    <header className="frame-header">
      {/* <Topbar menu={horizonMenu(menu[0].children||[])} user={user} /> */}
      <Header {...props} menu={navMenu} projList={projList} collapseMenu={collapseMenu} theme={theme} switchTheme={switchTheme} />
    </header>
    <main className="frame-main">
      <Main {...props} showMenu={showMenuCls} menu={sideMenu} width={winSize.width} />
    </main>
    <footer className={`frame-footer${showMenuCls}`}>
      <Footer />
    </footer>
  </div>;
};


export default Frame;




































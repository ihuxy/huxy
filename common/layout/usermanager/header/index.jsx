import React,{useState,useEffect,useRef} from 'react';
import {message} from 'antd';

import {Link,utils} from '@common';
const {storage,getPosition}=utils;

import { UserOutlined, PoweroffOutlined } from '@ant-design/icons';

import {title,themeList} from '@app/configs';

import logo from '@app/assets/images/usr.jpg';

import HoriMenu from './horiMenu';

import './index.less';

const navDrop=[
  {
    name:'个人中心',
    icon:<UserOutlined />,
    path:'',
  },
  {
    name:'退出',
    icon:<PoweroffOutlined />,
    path:'/user/login',
  },
];

const Header=props=>{
  const {collapseMenu,menu,projList,user,theme}=props;
  const userInfo=user?.result??{};

  const navRef=useRef();
  const navLeftRef=useRef();
  const navRightRef=useRef();

  const [showNav,setShowNav]=useState([]);
  const [showMenu,setShowMenu]=useState(false);
  const [selected,setSelected]=useState(theme);

  const [menuStyle,setMenuStyle]=useState({width:0});

  useEffect(()=>{
    const off=props.store.subscribe('winSize',value=>{
      const navW=getPosition(navRef.current).width;
      const left=navLeftRef.current;
      const right=navRightRef.current;
      setMenuStyle({
        width:navW-left.offsetWidth-right.offsetWidth-2,
      });
    });
    return ()=>off('winSize');
  },[]);

  useEffect(()=>{
    const navListeners=()=>{
      setShowNav([]);
      const w=window.innerWidth;
      if(w<1024){
        collapseMenu(false);
        setShowMenu(false);
      }
    };
    window.addEventListener('click',navListeners,false);
    return ()=>{
      window.removeEventListener('click',navListeners,false);
    };
  },[]);
  const toggleMenu=e=>{
    e.stopPropagation();
    setShowMenu(!showMenu);
    collapseMenu();
  };
  const toggleNav=(e,i)=>{
    e.stopPropagation();
    const newShowNav=[];
    newShowNav[i]=!showNav[i];
    setShowNav(newShowNav);
  };
  const selectedTheme=item=>{
    setSelected(item.key);
    // updateRouter({theme:item.key});
    props.switchTheme(item.key);
  };

  const handleNavClick=async item=>{
    if(item.path==='/user/login'){
      // const {message:msg}=await logoutFn();
      message.success('退出登录！');
      storage.rm('token');
      props.router.push(item.path);
    }
  };

  return <div className="header">
    <div className="header-wrap">
      <div className="banner">
        {/* <div className="logo"><img src={logo} alt="logo" /></div> */}
        <div className="title">{title}</div>
      </div>
      <div className="nav">
        <div className="nav-wrap" ref={navRef}>
          <ul className="nav-left" ref={navLeftRef}>
            <li className="collapseMenu" onClick={e=>toggleMenu(e)}>
              <a>
                {/* <i className="icon-navicon" /> */}
                <span className="anico">
                  <span className={`hline${showMenu?' right':''}`} />
                </span>
              </a>
            </li>
            <li>
              <a onClick={e=>toggleNav(e,2)}>主题</a>
              <ul className={`huxy-arrow-lt${showNav[2]?' show':''}`}>
                {
                  themeList.map(v=><li key={v.key}>
                    <a className={selected===v.key?'active':''} onClick={()=>selectedTheme(v)}>
                      <span>{v.name}</span>
                    </a>
                  </li>)
                }
              </ul>
            </li>
          </ul>
          {menu?.length?<HoriMenu menu={menu} style={menuStyle} />:null}
          <ul className="nav-right" ref={navRightRef}>
            <li>
              <a onClick={e=>toggleNav(e,0)}>
                <div className="avatar">
                  <img className="usr" src={userInfo?.avatar??logo} alt="user" />
                  <span>{userInfo?.name??'admin'}</span>
                  {/* <i className={`huxy-angle-${showNav[0]?'top':'bt'}`}/> */}
                </div>
              </a>
              <ul className={`huxy-arrow-rt${showNav[0]?' show':''}`}>
                {
                  navDrop.map(v=><li key={v.name}>
                    <a onClick={()=>handleNavClick(v)} className={v.active?'active':''}>
                      {v.icon}
                      <span className="drop-label">{v.name}</span>
                    </a>
                  </li>)
                }
              </ul>
            </li>
            <li>
              <a onClick={e=>toggleNav(e,1)}>
                <span>项目入口</span>
                <i className={`huxy-angle-${showNav[1]?'top':'bt'}`}/>
              </a>
              <ul className={`huxy-arrow-rt${showNav[1]?' show':''}`}>
                {
                  projList.map(v=><li key={v.name}>
                    <Link path={v.path} stopPropagation className={v.active?'active':''}>
                      {v.icon}
                      <span className="drop-label">{v.name}</span>
                    </Link>
                  </li>)
                }
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>;
};

export default Header;




































import React,{useEffect} from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {loginFn} from '@app/api/userApis';
import {utils} from '@common';

const {storage}=utils;

import styles from './index.less';

import {title} from '@app/configs';

const Index=props=>{
  useEffect(()=>{
    if(storage.get('token')){
      props.router.push('/');
    }
  },[]);
  const onFinish=async values=>{
    const {code,token,user,message:msg}=await loginFn(values);
    if(code===200){
      message.success(msg);
      storage.set('token',token);
      props.router.push('/');
    }
  };
  
  return <div className={styles.page}>
    <div className={styles['login-panel']}>
      <div className={styles.title}>
        <h2>{title}</h2>
      </div>
      <div className={styles.content}>
        <div>
          <Form
            name="login"
            className="login-form"
            initialValues={{
              remember: true,
              name:'test',
              password:'test1234',
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" style={{marginRight:'7px',color:'#999'}} />} placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" style={{marginRight:'7px',color:'#999'}} />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" className="login-form-button">登录</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  </div>;
};

export default Index;


















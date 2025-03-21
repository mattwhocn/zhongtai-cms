import React from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import ImageManagement from './pages/ImageManagement';
import ContentManagement from './pages/ContentManagement';
import MarkdownManagement from './pages/MarkdownManagement';
import './App.css';

const { Header, Content } = Layout;

// 创建一个导航组件来处理标题显示
const Navigation = (props) => {
  const location = useLocation();
  
  const items = [
    {
      key: '/content',
      label: <Link to="/content">内容管理</Link>
    },
    {
      key: '/images',
      label: <Link to="/images">图片管理</Link>
    },
    {
      key: '/markdown',
      label: <Link to="/markdown">Markdown管理</Link>
    }
  ];

  return (
    <Menu
      theme="dark"
      style={props.style}
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
    />
  );
};

const App = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo">
            <span className="logo-text">中泰民安后台管理</span>
          </div>
          <Navigation style={{ flex: 1 }} />
        </Header>
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<ContentManagement />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/images" element={<ImageManagement />} />
            <Route path="/markdown" element={<MarkdownManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;

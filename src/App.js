import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import { PictureOutlined, FileOutlined } from '@ant-design/icons';
import ImageManagement from './pages/ImageManagement';
import ContentManagement from './pages/ContentManagement';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout className="layout">
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <PictureOutlined />,
                label: <Link to="/image">图片管理</Link>,
              },
              {
                key: '2',
                icon: <FileOutlined />,
                label: <Link to="/content">内容管理</Link>,
              },
            ]}
          />
        </Header>
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ background: colorBgContainer, padding: 24, borderRadius: 4 }}>
            <Routes>
              <Route path="/image" element={<ImageManagement />} />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/" element={<ImageManagement />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;

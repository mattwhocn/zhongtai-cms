import React, { useState, useEffect } from 'react';
import { Upload, Button, Table, message, Space, Tag, Card, Modal, Tabs } from 'antd';
import { 
  UploadOutlined, 
  CheckCircleOutlined, 
  DownloadOutlined,
  DeleteOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import config, { getApiUrl, getResourceUrl } from '../config/config';

const MODULES = [
  { key: 'home', label: '首页' },
  { key: 'news', label: '新闻' },
  { key: 'about', label: '关于' },
  { key: 'sustainability', label: '可持续发展' },
  { key: 'career', label: '招聘' },
  { key: 'contact', label: '联系' },
  { key: 'business', label: '业务' }
];

const ContentManagement = () => {
  const [currentModule, setCurrentModule] = useState('home');
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  useEffect(() => {
    fetchContentList();
  }, [currentModule]);

  const fetchContentList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getApiUrl(config.api.content.list), {
        params: { module: currentModule }
      });
      setContentList(response.data.data || []);
    } catch (error) {
      message.error('获取内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', currentModule);

    try {
      const response = await axios.post(getApiUrl(config.api.content.upload), formData);
      if (response.data.success) {
        message.success('上传成功');
        fetchContentList();
      } else {
        message.error('上传失败');
      }
    } catch (error) {
      message.error('上传失败: ' + error.message);
    }
  };

  const handleUse = async (record) => {
    try {
      const response = await axios.get(getApiUrl(config.api.content.use), {
        params: {
          id: record.id,
          path: record.path,
          module: currentModule
        }
      });
      if (response.data.success) {
        message.success('使用成功');
        fetchContentList();
      } else {
        message.error('使用失败');
      }
    } catch (error) {
      message.error('使用失败: ' + error.message);
    }
  };

  const handleDownload = async (path, originalName) => {
    try {
      const response = await axios.get(getResourceUrl(path), {
        responseType: 'blob'
      });
      
      // 从原始文件名中提取文件名和扩展名，并移除-active后缀
      let downloadName = originalName;
      // 先移除-active后缀（如果有的话）
      if (downloadName.endsWith('-active')) {
        downloadName = downloadName.slice(0, -7);
      }
      // 再移除时间戳前缀
      const lastDashIndex = downloadName.indexOf('-');
      downloadName = lastDashIndex !== -1 ? downloadName.slice(lastDashIndex + 1) : downloadName;
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('下载失败: ' + error.message);
    }
  };

  const showDeleteConfirm = (content) => {
    setCurrentContent(content);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!currentContent) return;

    try {
      const response = await axios.get(getApiUrl(config.api.content.delete), {
        params: {
          id: currentContent.id,
          path: currentContent.path
        }
      });
      
      if (response.data.success) {
        message.success('删除成功');
        fetchContentList();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败: ' + error.message);
    } finally {
      setDeleteModalVisible(false);
      setCurrentContent(null);
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 450,
      render: (name, record) => (
        <Space>
          {name}
          <Tag color={record.status === 'used' ? 'green' : 'blue'}>
            {record.status === 'used' ? '使用中' : '未使用'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 150,
      render: (time) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleUse(record)}
            disabled={record.status === 'used'}
          >
            {record.status === 'used' ? '使用中' : '使用'}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.path, record.id)}
          >
            下载
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setCurrentModule(key);
  };

  const ContentTable = () => (
    <>
      <div className="upload-section" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Upload
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
          accept=".xlsx,.xls"
        >
          <Button 
            icon={<UploadOutlined />} 
            type="primary" 
            size="middle"
            disabled={contentList.length >= 8}
          >
            上传内容
          </Button>
        </Upload>
        <span style={{ color: '#666' }}>
          已上传: {contentList.length}/8
        </span>
      </div>

      <Table
        columns={columns}
        dataSource={contentList}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1200 }}
        size="small"
        bordered
      />
    </>
  );

  const items = MODULES.map(module => ({
    key: module.key,
    label: module.label,
    children: <ContentTable />
  }));

  return (
    <Card title="内容管理" className="content-management" size="small">
      <Tabs
        activeKey={currentModule}
        onChange={handleTabChange}
        items={items}
        type="card"
        size="small"
        style={{ marginBottom: '16px' }}
      />

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCurrentContent(null);
        }}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除文件 "{currentContent?.name}" 吗？</p>
        <p style={{ color: '#999', fontSize: '12px' }}>删除后将无法恢复，请谨慎操作。</p>
      </Modal>
    </Card>
  );
};

export default ContentManagement; 
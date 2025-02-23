import React, { useState, useEffect } from 'react';
import { Upload, Button, Table, message, Space, Tag, Card, Modal } from 'antd';
import { 
  UploadOutlined, 
  CheckCircleOutlined, 
  DownloadOutlined,
  DeleteOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const ContentManagement = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);

  useEffect(() => {
    fetchContentList();
  }, []);

  const fetchContentList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/content/list');
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

    try {
      const response = await axios.post('http://localhost:3001/content/upload', formData);
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
      const response = await axios.get(`http://localhost:3001/content/use`, {
        params: {
          id: record.id,
          path: record.path
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
      const response = await axios.get(`http://localhost:3001/${path}`, {
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
      const response = await axios.get(`http://localhost:3001/content/del`, {
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
      width: 400,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'used' ? 'green' : 'blue'}>
          {status === 'used' ? '已使用' : '未使用'}
        </Tag>
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

  return (
    <Card title="内容管理" className="content-management" size="small">
      <div className="upload-section" style={{ marginBottom: '16px' }}>
        <Upload
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
          accept=".xlsx,.xls,.doc,.docx,.pdf"
        >
          <Button icon={<UploadOutlined />} type="primary" size="small">
            上传内容
          </Button>
        </Upload>
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
      >
        <p>确定要删除这个文件吗？</p>
      </Modal>
    </Card>
  );
};

export default ContentManagement; 
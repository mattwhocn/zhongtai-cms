import React, { useState } from 'react';
import { Button, Card, Table, message, Modal, Space, Upload } from 'antd';
import { DeleteOutlined, EyeOutlined, CopyOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { copyToClipboard } from '../utils/copyUtils';
import config, { getApiUrl, getResourceUrl } from '../config/config';

const MarkdownManagement = () => {
  const [markdownList, setMarkdownList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const fetchMarkdownList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getApiUrl(config.api.markdown.list));
      if (response.data.success) {
        setMarkdownList(response.data.data);
      }
    } catch (error) {
      message.error('获取列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (filePath) => {
    try {
      const response = await axios.get(getResourceUrl(filePath));
      setPreviewContent(response.data);
      setPreviewVisible(true);
    } catch (error) {
      message.error('预览失败: ' + error.message);
    }
  };

  const showDeleteConfirm = (file) => {
    setCurrentFile(file);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!currentFile) return;

    try {
      const response = await axios.get(getApiUrl(config.api.markdown.delete), {
        params: {
          id: currentFile.id,
          path: currentFile.path
        }
      });
      
      if (response.data.success) {
        message.success('删除成功');
        fetchMarkdownList();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败: ' + error.message);
    } finally {
      setDeleteModalVisible(false);
      setCurrentFile(null);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class', 'markdown');

    try {
      const response = await axios.post(getApiUrl(config.api.markdown.upload), formData);
      if (response.data.success) {
        message.success('上传成功');
        fetchMarkdownList();
      } else {
        message.error('上传失败');
      }
    } catch (error) {
      message.error('上传失败: ' + error.message);
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '文件路径',
      dataIndex: 'path',
      key: 'path',
      width: 400,
      ellipsis: true,
      render: (path) => {
        const fullUrl = getResourceUrl(path);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{ 
                color: '#666', 
                cursor: 'pointer',
                marginRight: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              onClick={() => copyToClipboard(fullUrl)}
              title="点击复制文件路径"
            >
              {fullUrl}
            </span>
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(fullUrl)}
              title="复制文件路径"
              style={{ padding: '0 4px', minWidth: 'auto' }}
            />
          </div>
        );
      },
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
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record.path)}
          >
            预览
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

  React.useEffect(() => {
    fetchMarkdownList();
  }, []);

  return (
    <Card title="Markdown管理" className="markdown-management">
      <div className="upload-section">
        <Upload
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
          accept=".md,.markdown"
        >
          <Button icon={<UploadOutlined />} type="primary" size="middle">
            上传Markdown
          </Button>
        </Upload>
      </div>

      <Table
        columns={columns}
        dataSource={markdownList}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1300 }}
      />

      <Modal
        title="Markdown预览"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {previewContent}
        </pre>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCurrentFile(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要删除这个Markdown文件吗？</p>
      </Modal>
    </Card>
  );
};

export default MarkdownManagement; 
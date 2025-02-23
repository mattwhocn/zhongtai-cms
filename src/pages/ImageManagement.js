import React, { useState } from 'react';
import { Button, Card, Table, message, Modal, Space } from 'antd';
import { DeleteOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons';
import { useImageList } from '../hooks/useImageList';
import { ImageUploader } from '../components/ImageUploader';
import { copyToClipboard } from '../utils/copyUtils';
import axios from 'axios';

const ImageManagement = () => {
  const { imageList, loading, fetchImageList } = useImageList();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const handlePreview = (imagePath) => {
    setPreviewImage(`http://localhost:3001/${imagePath}`);
    setPreviewVisible(true);
  };

  const showDeleteConfirm = (image) => {
    setCurrentImage(image);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    try {
      const response = await axios.get(`http://localhost:3001/img/del`, {
        params: {
          id: currentImage.id,
          path: currentImage.path
        }
      });
      
      if (response.data.success) {
        message.success('删除成功');
        fetchImageList();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败: ' + error.message);
    } finally {
      setDeleteModalVisible(false);
      setCurrentImage(null);
    }
  };

  const columns = [
    {
      title: '缩略图',
      dataIndex: 'path',
      key: 'thumbnail',
      width: 80,
      render: (path) => (
        <img
          src={`http://localhost:3001/${path}`}
          alt="缩略图"
          style={{ width: 40, height: 40, objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handlePreview(path)}
        />
      ),
    },
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '图片地址',
      dataIndex: 'path',
      key: 'path',
      width: 400,
      ellipsis: true,
      render: (path) => {
        const fullUrl = `http://localhost:3001/${path}`;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{ color: '#666', cursor: 'pointer', flex: 1 }}
              onClick={() => copyToClipboard(fullUrl)}
              title="点击复制图片地址"
            >
              {fullUrl}
            </span>
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(fullUrl)}
              title="复制图片地址"
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

  return (
    <Card title="图片管理" className="image-management">
      <ImageUploader onUploadSuccess={fetchImageList} />

      <Table
        columns={columns}
        dataSource={imageList}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 1300 }}
      />

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCurrentImage(null);
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要删除这张图片吗？</p>
      </Modal>
    </Card>
  );
};

export default ImageManagement; 
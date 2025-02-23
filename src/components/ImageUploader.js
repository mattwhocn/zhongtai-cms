import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export const ImageUploader = ({ onUploadSuccess }) => {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('class', 'default');

    try {
      const response = await axios.post('http://localhost:3001/img/upload', formData);
      if (response.data.success) {
        message.success('上传成功');
        onUploadSuccess();
      } else {
        message.error('上传失败');
      }
    } catch (error) {
      message.error('上传失败: ' + error.message);
    }
  };

  return (
    <div className="upload-section">
      <Upload
        customRequest={({ file }) => handleUpload(file)}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} type="primary">
          上传图片
        </Button>
      </Upload>
    </div>
  );
}; 
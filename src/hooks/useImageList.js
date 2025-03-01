import { useState, useEffect } from 'react';
import { message } from 'antd';
import axios from 'axios';
import config, { getApiUrl } from '../config/config';

export const useImageList = () => {
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImageList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getApiUrl(config.api.image.list));
      setImageList(response.data.data || []);
    } catch (error) {
      message.error('获取图片列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageList();
  }, []);

  return {
    imageList,
    loading,
    fetchImageList
  };
}; 
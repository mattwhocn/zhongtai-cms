import copy from 'copy-to-clipboard';
import { notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

export const copyToClipboard = (url) => {
  try {
    const success = copy(url);
    if (success) {
      notification.success({
        message: '复制成功',
        description: '图片地址已复制到剪贴板',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 3
      });
    } else {
      notification.error({
        message: '复制失败',
        description: '请手动复制图片地址',
        placement: 'topRight',
        duration: 3
      });
    }
  } catch (error) {
    notification.error({
      message: '复制失败',
      description: error.message,
      placement: 'topRight',
      duration: 3
    });
  }
}; 
import copy from 'copy-to-clipboard';
import { message } from 'antd';


export const copyToClipboard = (url) => {
  try {
    const success = copy(url);
    if (success) {
      message.success({
        content: '复制成功',
        duration: 2
      });
    } else {
      message.error({
        content: '复制失败，请手动复制',
        duration: 2
      });
    }
  } catch (error) {
    message.error({
      content: '复制失败：' + error.message,
      duration: 2
    });
  }
}; 
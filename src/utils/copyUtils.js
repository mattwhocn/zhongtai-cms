import copy from 'copy-to-clipboard';
import { message } from 'antd';


export const copyToClipboard = (url) => {
  try {
    const success = copy(url);
    if (success) {
      alert('复制成功')
      // message.success({
      //   content: '复制成功',
      //   duration: 2,
      //   className: 'custom-message',
        
      // });
    } else {
      alert('复制失败，请手动复制')

      // message.error({
      //   content: '复制失败，请手动复制',
      //   duration: 2,
      //   className: 'custom-message',
        
      // });
    }
  } catch (error) {
    alert('复制失败：' + error.message)
    // message.error({
    //   content: '复制失败：' + error.message,
    //   duration: 2,
    //   className: 'custom-message',
      
    // });
  }
}; 
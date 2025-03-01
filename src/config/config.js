export const config = {
  baseURL: 'http://localhost:3001',
  api: {
    // 图片相关接口
    image: {
      upload: '/img/upload',
      list: '/img/list',
      delete: '/img/del'
    },
    // 内容相关接口
    content: {
      upload: '/content/upload',
      list: '/content/list',
      use: '/content/use',
      delete: '/content/del'
    }
  }
};

// 获取完整的API URL
export const getApiUrl = (path) => `${config.baseURL}${path}`;

// 获取资源的完整URL（图片、文件等）
export const getResourceUrl = (path) => `${config.baseURL}/${path}`;

export default config; 
export const config = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://api.ztmagroup.com'
    : 'http://localhost:3002',
  resourceURL: process.env.NODE_ENV === 'production' 
    ? 'http://static.ztmagroup.com'
    : 'http://localhost:3002',
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
    },
    // markdown相关接口
    markdown: {
      upload: '/markdown/upload',
      list: '/markdown/list',
      delete: '/markdown/del'
    }
  }
};

// 获取完整的API URL
export const getApiUrl = (path) => `${config.baseURL}${path}`;

// 获取资源的完整URL（图片、文件等）
export const getResourceUrl = (path) => `${config.resourceURL}/${path}`;

export default config; 
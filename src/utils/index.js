/**
 * 获取url参数
 * @param {String} url url地址
 * @param {String} name 参数名称
 */
export const getQueryString = (url, name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  const r = url.slice(url.search(/\?/)).substr(1).match(reg)
  if (r != null) { return unescape(r[2]) }
  return null
}

/**
 * 函数去抖,针对winodw.onresize等事件
 * @param {Function} method 需要去抖的方法
 */
export const debounce = method => {
  if (method.timeout) clearTimeout(method.timeout)
  method.timeout = setTimeout(() => {
    method()
  }, 500)
}

/**
 * 识别是否为微信浏览器
 */
export const isWeixinBrowser = () => /micromessenger/.test(navigator.userAgent.toLowerCase())


/**
 * 判断是否为空对象
 * @param {*} obj 
 */
export const isEmptyObject = obj => {
  for (let name in obj) {
    return false
  }
  return true
}

/**
 * 面包屑配置
 */
export const getBreadInfo = (url) => {
  const breadConfig = {
    '/users': ['数据管理', '用户管理', '用户数据'],
    '/books': ['数据管理', '图书管理', '图书数据'],
    '/order': ['数据管理', '订单管理', '订单数据'],
    '/distribution': ['数据管理', '分配管理', '分配数据']
  }
  let breadInfo = breadConfig[Object.keys(breadConfig).find((item, index) => item === url)]
  if (url === '/') {
    breadInfo = breadConfig['/users']
  }
  return breadInfo ? breadInfo : []
}

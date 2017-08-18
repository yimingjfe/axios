'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  // instance是一个函数,函数中的this是context,函数的主体执行时Axios.prototype.request
  // intance继承了Axios.prototype中所有的方法，将这些方法的this都设为context
  // 将context中的所有属性给instance
  var context = new Axios(defaultConfig);

  var instance = bind(Axios.prototype.request, context);
  // 遍历对象的forEach封装的是哪一个？
  // 拦截器是如何工作的?
  //XMLHttpRequest与适配器是如何工作的？
  utils.extend(instance, Axios.prototype, context);
  //要拿到构造函数继承的方法
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
// 这块可以看看怎么实现的
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  console.log('是否与window的Promise相同', window.Promise === Promise)
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

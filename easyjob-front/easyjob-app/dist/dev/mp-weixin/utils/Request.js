"use strict";
const common_vendor = require("../common/vendor.js");
const utils_Message = require("./Message.js");
const utils_Constants = require("./Constants.js");
const utils_Api = require("./Api.js");
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const responseTypeJson = "json";
let port = common_vendor.index.getSystemInfoSync().uniPlatform;
let BASE_URL = utils_Api.api.domain + "/api";
if (port == "web") {
  BASE_URL = "/api";
} else {
  BASE_URL = utils_Api.api.domain + "/api";
}
const request = (config) => {
  const {
    url,
    params,
    dataType,
    showLoading = true,
    showError = true,
    errorCallback,
    responseType = responseTypeJson
  } = config;
  let contentType = contentTypeForm;
  if (dataType != null && dataType == "json") {
    contentType = contentTypeJson;
  }
  let headers = {
    "Content-Type": contentType,
    "X-Requested-With": "XMLHttpRequest",
    "token": common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key)
  };
  if (params) {
    for (let item in params) {
      if (params[item] == void 0) {
        params[item] = "";
      }
    }
  }
  return new Promise((resolve, reject) => {
    if (showLoading) {
      common_vendor.index.showLoading();
    }
    common_vendor.index.request({
      url: BASE_URL + url,
      data: params,
      header: headers,
      responseType,
      method: "POST"
    }).then((res) => {
      if (showLoading) {
        common_vendor.index.hideLoading();
      }
      common_vendor.index.stopPullDownRefresh();
      if (res.statusCode != 200) {
        return Promise.reject("网络连接错误");
      }
      const responseData = res.data;
      if (responseType == "arraybuffer" || responseType == "blob") {
        resolve(responseData);
        return;
      }
      if (responseData.code == 200) {
        resolve(responseData);
        return;
      } else if (responseData.code == 901) {
        common_vendor.index.navigateTo({
          url: "/pages/account/LoginAndRegister"
        });
        return Promise.reject();
      } else {
        if (errorCallback) {
          errorCallback(responseData.info);
        }
        return Promise.reject(responseData.info);
      }
    }).catch((error) => {
      if (error && showError) {
        utils_Message.message.error(error);
      }
      return null;
    });
  });
};
exports.request = request;

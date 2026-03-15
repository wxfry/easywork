"use strict";
const common_vendor = require("../common/vendor.js");
const message = {
  error: (msg, callback) => {
    console.log("msg----------", msg);
    common_vendor.index.showToast({
      title: msg,
      icon: "none",
      success: callback ? callback : null
    });
  },
  success: (msg, callback) => {
    common_vendor.index.showToast({
      title: msg,
      icon: "sucess",
      success: callback ? callback : null
    });
  },
  warning: (msg, callback) => {
    common_vendor.index.showToast({
      title: msg,
      icon: "none",
      success: callback ? callback : null
    });
  }
};
exports.message = message;

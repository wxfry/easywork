"use strict";
const common_vendor = require("../common/vendor.js");
const confirm = (message, okfun) => {
  common_vendor.index.showModal({
    title: "确认操作",
    content: message,
    success: function(res) {
      if (res.confirm) {
        okfun();
      }
    }
  });
};
exports.confirm = confirm;

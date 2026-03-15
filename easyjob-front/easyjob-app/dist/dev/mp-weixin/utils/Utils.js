"use strict";
const Utils = {
  dateformat: (date) => {
    if (date == null) {
      return "";
    }
    return date.substr(0, 10);
  },
  size2Str: (limit) => {
    var size = "";
    if (limit < 1024) {
      size = limit.toFixed(2) + "B";
    } else if (limit < 1024 * 1024) {
      size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 1024 * 1024 * 1024) {
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    var sizeStr = size + "";
    var index = sizeStr.indexOf(".");
    var dou = sizeStr.substr(index + 1, 2);
    if (dou == "00") {
      return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
    }
    return size;
  }
};
exports.Utils = Utils;

"use strict";
const common_vendor = require("../common/vendor.js");
const useQuestionCategoryStore = common_vendor.defineStore("questionCategoryInfo", {
  state: () => {
    return {
      categoryList: []
    };
  },
  actions: {
    setInfo(categoryList) {
      this.categoryList = categoryList;
    },
    getInfo() {
      return this.categoryList;
    }
  }
});
exports.useQuestionCategoryStore = useQuestionCategoryStore;

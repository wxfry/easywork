"use strict";
const common_vendor = require("../common/vendor.js");
const useBookCategoryStore = common_vendor.defineStore("bookCategoryInfo", {
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
common_vendor.defineStore("SourceCategoryInfo", {
  state: () => {
    return {
      sourceCategoryList: []
    };
  },
  actions: {
    setInfo(questionList) {
      this.sourceCategoryList = sourceCategoryList;
    },
    getInfo() {
      return this.sourceCategoryList;
    }
  }
});
common_vendor.defineStore("SectionCategoryInfo", {
  state: () => {
    return {
      sectionCategoryList: []
    };
  },
  actions: {
    setInfo(questionList) {
      this.sectionCategoryList = sectionCategoryList;
    },
    getInfo() {
      return this.sectionCategoryList;
    }
  }
});
common_vendor.defineStore("PointCategoryInfo", {
  state: () => {
    return {
      pointCategoryList: []
    };
  },
  actions: {
    setInfo(questionList) {
      this.pointCategoryList = pointCategoryList;
    },
    getInfo() {
      return this.pointCategoryList;
    }
  }
});
exports.useBookCategoryStore = useBookCategoryStore;

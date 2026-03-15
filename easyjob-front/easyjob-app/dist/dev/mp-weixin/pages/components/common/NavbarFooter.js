"use strict";
const common_vendor = require("../../../common/vendor.js");
const stores_appInfo = require("../../../stores/appInfo.js");
const _sfc_main = {
  __name: "NavbarFooter",
  props: {
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  setup(__props) {
    stores_appInfo.useAppInfoStore();
    const tabBar = {
      color: "#494949",
      selectedColor: "#8f60df",
      backgroundColor: "#fff",
      height: "60px",
      list: [
        {
          pagePath: "pages/Index",
          text: "首页",
          iconfont: {
            text: "",
            selectedText: "",
            fontSize: "22px",
            color: "#494949",
            selectedColor: "#8f60df"
          }
        },
        {
          pagePath: "pages/classification/Classify",
          text: "分类",
          iconfont: {
            text: "",
            selectedText: "",
            fontSize: "22px",
            color: "#494949",
            selectedColor: "#8f60df"
          }
        },
        {
          pagePath: "pages/exam/ExamIndex",
          text: "在线考试",
          iconfont: {
            text: "",
            selectedText: "",
            fontSize: "22px",
            color: "#494949",
            selectedColor: "#8f60df"
          }
        },
        {
          pagePath: "pages/commend/commendIndex",
          text: "学习统计",
          iconfont: {
            text: "",
            selectedText: "",
            fontSize: "22px",
            color: "#494949",
            selectedColor: "#8f60df"
          }
        },
        {
          pagePath: "pages/my/MyIndex",
          text: "我的",
          iconfont: {
            text: "",
            selectedText: "",
            fontSize: "22px",
            color: "#494949",
            selectedColor: "#8f60df"
          }
        }
      ]
    };
    const handleTabClick = (index) => {
      common_vendor.index.navigateTo({
        url: "/" + tabBar.list[index].pagePath
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabBar.list, (item, index, i0) => {
          return {
            a: common_vendor.t(__props.currentIndex === index ? item.iconfont.selectedText : item.iconfont.text),
            b: __props.currentIndex === index ? tabBar.selectedColor : tabBar.color,
            c: common_vendor.t(item.text),
            d: __props.currentIndex === index ? tabBar.selectedColor : tabBar.color,
            e: index,
            f: __props.currentIndex === index ? 1 : "",
            g: common_vendor.o(($event) => handleTabClick(index), index)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c878b799"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/components/common/NavbarFooter.vue"]]);
wx.createComponent(Component);

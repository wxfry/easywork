"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _component_Navbar = common_vendor.resolveComponent("Navbar");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  (_component_Navbar + _easycom_uni_data_checkbox2)();
}
const _easycom_uni_data_checkbox = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.js";
if (!Math) {
  (_easycom_uni_data_checkbox + ExamNoFinishedModel + NavbarFooter)();
}
const ExamNoFinishedModel = () => "./ExamNoFinishedModel.js";
const NavbarFooter = () => "../components/common/NavbarFooter.js";
const _sfc_main = {
  __name: "ExamIndex",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const categoryList = common_vendor.ref([]);
    const loadData = async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadAllCategory,
        params: {
          type: 1
        },
        showLoading: false
      });
      if (!result) {
        return;
      }
      categoryList.value = result.data;
    };
    loadData();
    const selectAll = common_vendor.ref();
    const selectAllHandler = (e) => {
      if (e.detail.value.length == 0) {
        categoryIds.value = [];
      } else {
        categoryIds.value = categoryList.value.map((item) => {
          return item.categoryId;
        });
      }
    };
    const categoryIds = common_vendor.ref([]);
    const createExam = async () => {
      if (categoryIds.value.length == 0) {
        proxy.Message.warning("请选择分类");
        return;
      }
      const token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
      if (token == "" || token == null) {
        common_vendor.index.navigateTo({
          url: "/pages/account/LoginAndRegister"
        });
      }
      let result = await proxy.Request({
        url: proxy.Api.createExam,
        params: {
          categoryIds: categoryIds.value.join(","),
          type: 0
        }
      });
      if (!result) {
        return;
      }
      common_vendor.index.navigateTo({
        url: "./ExamQuestion?examId=" + result.data.examId
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showLeft: false,
          title: "在线考试"
        }),
        b: common_vendor.o(($event) => categoryIds.value = $event),
        c: common_vendor.p({
          mode: "list",
          multiple: true,
          map: {
            text: "categoryName",
            value: "categoryId"
          },
          localdata: categoryList.value,
          modelValue: categoryIds.value
        }),
        d: common_vendor.o(selectAllHandler),
        e: common_vendor.o(($event) => selectAll.value = $event),
        f: common_vendor.p({
          multiple: true,
          localdata: [{
            value: 1,
            text: "全选！"
          }],
          modelValue: selectAll.value
        }),
        g: common_vendor.o(createExam),
        h: common_vendor.p({
          currentIndex: 2
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-af9f6ffa"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/exam/ExamIndex.vue"]]);
wx.createPage(MiniProgramPage);

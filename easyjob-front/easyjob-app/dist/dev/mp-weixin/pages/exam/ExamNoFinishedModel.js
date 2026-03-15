"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _component_Dialog = common_vendor.resolveComponent("Dialog");
  _component_Dialog();
}
if (!Math) {
  ExamRecord();
}
const ExamRecord = () => "./ExamRecord.js";
const _sfc_main = {
  __name: "ExamNoFinishedModel",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const dataList = common_vendor.ref([]);
    const loadExam = async () => {
      let result = await proxy.Request({
        url: proxy.Api.loadNoFinishedExam,
        showLoading: true
      });
      if (!result) {
        return;
      }
      if (result.data != null && result.data.length > 0) {
        dialogRef.value.show();
        dataList.value = result.data;
      } else {
        dialogRef.value.close();
      }
    };
    const dialogRef = common_vendor.ref();
    common_vendor.onShow(() => {
      const token = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key);
      if (!token) {
        return;
      }
      loadExam();
    });
    const close = () => {
      dialogRef.value.close();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(dataList.value, (item, k0, i0) => {
          return {
            a: "56c6b0f6-1-" + i0 + ",56c6b0f6-0",
            b: common_vendor.p({
              data: item
            })
          };
        }),
        b: common_vendor.o(loadExam),
        c: common_vendor.sr(dialogRef, "56c6b0f6-0", {
          "k": "dialogRef"
        }),
        d: common_vendor.p({
          title: "未完成的考试",
          showCancel: false,
          okText: "开启新考试",
          okFun: close
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/exam/ExamNoFinishedModel.vue"]]);
wx.createComponent(Component);

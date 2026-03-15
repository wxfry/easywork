"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ExamRecord",
  props: {
    data: {
      type: Object
    }
  },
  emits: ["reload"],
  setup(__props, { emit }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const delExam = (examId) => {
      proxy.Confirm("确认要删除考试记录吗？", async () => {
        let result = await proxy.Request({
          url: proxy.Api.delExam,
          params: {
            examId
          }
        });
        if (!result) {
          return;
        }
        proxy.Message.success("删除成功");
        emit("reload");
      });
    };
    const reStart = (examId) => {
      common_vendor.index.navigateTo({
        url: "/pages/exam/ExamQuestion?examId=" + examId
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.data.remark || __props.data.createTime),
        b: common_vendor.t(__props.data.status == 0 ? "继续" : "查看"),
        c: common_vendor.o(($event) => reStart(__props.data.examId)),
        d: common_vendor.o(($event) => delExam(__props.data.examId))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-35b61b65"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/exam/ExamRecord.vue"]]);
wx.createComponent(Component);

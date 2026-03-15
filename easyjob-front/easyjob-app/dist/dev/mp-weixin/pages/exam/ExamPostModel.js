"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _component_Dialog = common_vendor.resolveComponent("Dialog");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _component_Dialog)();
}
const _easycom_uni_easyinput = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "ExamPostModel",
  emits: ["postExam"],
  setup(__props, { expose, emit }) {
    const formData = common_vendor.ref({});
    const formDataRef = common_vendor.ref();
    const rules = {
      remark: {
        rules: [{ required: false, errorMessage: "请输入内容" }]
      }
    };
    const submit = () => {
      formDataRef.value.validate((errors, value) => {
        if (errors) {
          return;
        }
        emit("postExam", formData.value.remark);
      });
    };
    const postExamRef = common_vendor.ref();
    const show = () => {
      postExamRef.value.show();
      common_vendor.nextTick$1(() => {
        formDataRef.value.clearValidate();
      });
    };
    const close = () => {
      postExamRef.value.close();
    };
    expose({
      show,
      close
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.value.remark = $event),
        b: common_vendor.p({
          placeholder: "请输入备注",
          trim: true,
          modelValue: formData.value.remark
        }),
        c: common_vendor.p({
          name: "remark"
        }),
        d: common_vendor.sr(formDataRef, "74132418-1,74132418-0", {
          "k": "formDataRef"
        }),
        e: common_vendor.p({
          model: formData.value,
          ["label-width"]: "0",
          rules
        }),
        f: common_vendor.sr(postExamRef, "74132418-0", {
          "k": "postExamRef"
        }),
        g: common_vendor.p({
          title: "提交考试",
          showCancel: true,
          okFun: submit,
          okText: "提交考试"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/exam/ExamPostModel.vue"]]);
wx.createComponent(Component);

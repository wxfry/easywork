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
  __name: "FeedBackEdit",
  emits: ["reload"],
  setup(__props, { expose, emit }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const formData = common_vendor.ref({});
    const formDataRef = common_vendor.ref();
    const rules = {
      remark: {
        rules: [{ required: true, errorMessage: "请输入问题" }]
      }
    };
    const submit = () => {
      formDataRef.value.validate(async (errors, value) => {
        if (errors) {
          return;
        }
        const params = Object.assign({}, formData.value);
        console.log("params", params);
        let result = await proxy.Request({
          url: proxy.Api.sendFeedback,
          params
        });
        if (!result) {
          return;
        }
        close();
        emit("reload");
      });
    };
    const dialogRef = common_vendor.ref();
    const show = (data) => {
      dialogRef.value.show();
      common_vendor.nextTick$1(() => {
        if (formDataRef.value) {
          formDataRef.value.clearValidate();
        }
        formData.value = Object.assign({}, data);
        console.log("formData", formData.value);
      });
    };
    const close = () => {
      dialogRef.value.close();
    };
    expose({
      show,
      close
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.value.content = $event),
        b: common_vendor.p({
          type: "textarea",
          placeholder: "请输入问题",
          trim: true,
          maxlength: 500,
          modelValue: formData.value.content
        }),
        c: common_vendor.p({
          name: "content"
        }),
        d: common_vendor.sr(formDataRef, "fa898a78-1,fa898a78-0", {
          "k": "formDataRef"
        }),
        e: common_vendor.p({
          model: formData.value,
          ["label-width"]: "0",
          rules
        }),
        f: common_vendor.sr(dialogRef, "fa898a78-0", {
          "k": "dialogRef"
        }),
        g: common_vendor.p({
          title: "问题反馈",
          showCancel: true,
          okFun: submit,
          okText: "提交"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/FeedBackEdit.vue"]]);
wx.createComponent(Component);

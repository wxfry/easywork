"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _component_Dialog = common_vendor.resolveComponent("Dialog");
  (_easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_easyinput2 + _easycom_uni_forms2 + _component_Dialog)();
}
const _easycom_uni_forms_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_easyinput = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_easyinput + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "MyEditInfo",
  emits: ["reload"],
  setup(__props, { expose, emit }) {
    const { proxy } = common_vendor.getCurrentInstance();
    const checkRePassword = (rule, value, data, callback) => {
      if (value != "" && value !== formData.value.password) {
        callback("两次输入的密码不一致");
      }
      return true;
    };
    const formData = common_vendor.ref({});
    const formDataRef = common_vendor.ref();
    const rules = {
      sex: {
        rules: [{ required: true, errorMessage: "请选择性别" }]
      },
      password: {
        rules: [
          { maxLength: 18, errorMessage: "密码长度不能超过18个字符" },
          {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/,
            errorMessage: "密码必须含有数字字母或特殊字符长度不能少于8位"
          }
        ]
      },
      rePassword: {
        rules: [{ validateFunction: checkRePassword }]
      }
    };
    const submit = () => {
      formDataRef.value.validate(async (err, value) => {
        if (err) {
          return;
        }
        const params = Object.assign({}, formData.value);
        let result = await proxy.Request({
          url: proxy.Api.updateUserInfo,
          params
        });
        if (!result) {
          return;
        }
        proxy.Message.success("修改成功!");
        dialogRef.value.close();
        emit("reload");
      });
    };
    const dialogRef = common_vendor.ref();
    const show = (data) => {
      dialogRef.value.show();
      common_vendor.nextTick$1(() => {
        formDataRef.value.clearValidate();
        formData.value = Object.assign({}, data);
      });
    };
    expose({ show });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formData.value.nickName),
        b: common_vendor.p({
          name: "nickName",
          label: "昵称"
        }),
        c: common_vendor.o(($event) => formData.value.sex = $event),
        d: common_vendor.p({
          localdata: [{
            text: "男",
            value: 1
          }, {
            text: "女",
            value: 0
          }],
          modelValue: formData.value.sex
        }),
        e: common_vendor.p({
          name: "sex",
          label: "性别"
        }),
        f: common_vendor.o(($event) => formData.value.password = $event),
        g: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          prefixIcon: "locked",
          trim: true,
          modelValue: formData.value.password
        }),
        h: common_vendor.p({
          name: "password",
          label: "密码"
        }),
        i: common_vendor.o(($event) => formData.value.rePassword = $event),
        j: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          prefixIcon: "locked",
          trim: true,
          modelValue: formData.value.rePassword
        }),
        k: common_vendor.p({
          name: "rePassword",
          label: "重复密码"
        }),
        l: common_vendor.sr(formDataRef, "817c068c-1,817c068c-0", {
          "k": "formDataRef"
        }),
        m: common_vendor.p({
          model: formData.value,
          rules,
          ["label-width"]: 70,
          ["label-align"]: "right"
        }),
        n: common_vendor.sr(dialogRef, "817c068c-0", {
          "k": "dialogRef"
        }),
        o: common_vendor.p({
          title: "修改信息",
          showCancel: true,
          okFun: submit,
          okText: "确定"
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-817c068c"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/my/MyEditInfo.vue"]]);
wx.createComponent(Component);

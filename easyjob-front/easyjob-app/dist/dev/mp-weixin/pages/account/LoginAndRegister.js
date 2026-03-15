"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_appInfo = require("../../stores/appInfo.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_forms)();
}
const _sfc_main = {
  __name: "LoginAndRegister",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    const appInfoStore = stores_appInfo.useAppInfoStore();
    const { deviceId, deviceBrand } = appInfoStore.getInfo();
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const opType = common_vendor.ref(1);
    const changeOpType = () => {
      if (opType.value == 0) {
        opType.value = 1;
      } else {
        opType.value = 0;
      }
      resetForm();
    };
    const resetForm = () => {
      formDataRef.value.clearValidate();
      formData.value = {};
      changeCheckCode();
    };
    const checkCodeUrl = common_vendor.ref(null);
    const changeCheckCode = async () => {
      let result = await proxy.Request({
        url: proxy.Api.checkCode,
        showLoading: false,
        params: {
          deviceId,
          type: opType.value,
          time: new Date().getTime()
        },
        responseType: "arraybuffer"
      });
      if (!result) {
        return;
      }
      const arrayBuffer = new Uint8Array(result);
      const base64 = "data:image/png;base64," + common_vendor.index.arrayBufferToBase64(arrayBuffer);
      checkCodeUrl.value = base64 || "";
    };
    changeCheckCode();
    const checkRePassword = (rule, value, data, callback) => {
      if (value !== formData.value.password) {
        callback("两次输入的密码不一致");
      }
      return true;
    };
    const formData = common_vendor.ref({});
    const formDataRef = common_vendor.ref();
    const rules = {
      email: {
        rules: [
          { required: true, errorMessage: "请输入邮箱" },
          { maxLength: 20, errorMessage: "昵称长度不能超过20个字符" }
        ]
      },
      nickName: {
        rules: [
          { required: true, errorMessage: "请输入昵称" },
          { maxLength: 20, errorMessage: "昵称长度不能超过20个字符" }
        ]
      },
      sex: {
        rules: [{ required: true, errorMessage: "请选择性别" }]
      },
      password: {
        rules: [
          { required: true, errorMessage: "请输入密码" },
          { maxLength: 18, errorMessage: "密码长度不能超过18个字符" },
          {
            pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,}$/,
            errorMessage: "密码必须含有数字字母或特殊字符长度不能少于8位"
          }
        ]
      },
      rePassword: {
        rules: [
          { required: true, errorMessage: "请再次输入密码" },
          { validateFunction: checkRePassword }
        ]
      },
      checkCode: {
        rules: [{ required: true, errorMessage: "请输入验证码" }]
      }
    };
    const submitForm = () => {
      formDataRef.value.validate(async (err, value) => {
        if (err) {
          return;
        }
        let url = opType.value == 0 ? proxy.Api.register : proxy.Api.login;
        let params = {};
        Object.assign(params, formData.value);
        params.deviceId = deviceId;
        params.deviceBrand = deviceBrand;
        if (opType.value == 1) {
          params.password = common_vendor.md5Exports(params.password);
        }
        let result = await proxy.Request({
          url,
          params,
          errorCallback: () => {
            changeCheckCode();
          }
        });
        if (!result) {
          return;
        }
        if (opType.value == 0) {
          proxy.Message.success("注册成功");
          changeOpType();
        } else {
          proxy.Message.success("登录成功");
          common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.token.key, result.data);
          common_vendor.index.navigateBack();
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(opType.value == 0 ? "注册" : "登录"),
        b: common_vendor.o(goBack),
        c: common_vendor.o(($event) => formData.value.email = $event),
        d: common_vendor.p({
          placeholder: "请输入邮箱账号",
          prefixIcon: "email",
          trim: true,
          modelValue: formData.value.email
        }),
        e: common_vendor.p({
          name: "email"
        }),
        f: opType.value == 0
      }, opType.value == 0 ? {
        g: common_vendor.o(($event) => formData.value.nickName = $event),
        h: common_vendor.p({
          placeholder: "请输入邮箱昵称",
          prefixIcon: "email",
          trim: true,
          modelValue: formData.value.nickName
        }),
        i: common_vendor.p({
          name: "nickName"
        })
      } : {}, {
        j: opType.value == 0
      }, opType.value == 0 ? {
        k: common_vendor.o(($event) => formData.value.sex = $event),
        l: common_vendor.p({
          localdata: [{
            text: "男",
            value: 1
          }, {
            text: "女",
            value: 0
          }],
          modelValue: formData.value.sex
        }),
        m: common_vendor.p({
          name: "sex"
        })
      } : {}, {
        n: common_vendor.o(($event) => formData.value.password = $event),
        o: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          prefixIcon: "locked",
          trim: true,
          modelValue: formData.value.password
        }),
        p: common_vendor.p({
          name: "password"
        }),
        q: opType.value == 0
      }, opType.value == 0 ? {
        r: common_vendor.o(($event) => formData.value.rePassword = $event),
        s: common_vendor.p({
          type: "password",
          placeholder: "请再次输入密码",
          prefixIcon: "locked",
          trim: true,
          modelValue: formData.value.rePassword
        }),
        t: common_vendor.p({
          name: "rePassword"
        })
      } : {}, {
        v: common_vendor.o(($event) => formData.value.checkCode = $event),
        w: common_vendor.p({
          placeholder: "请输入验证码",
          prefixIcon: "paperplane",
          trim: true,
          modelValue: formData.value.checkCode
        }),
        x: checkCodeUrl.value,
        y: common_vendor.o(($event) => changeCheckCode()),
        z: common_vendor.p({
          name: "checkCode"
        }),
        A: common_vendor.sr(formDataRef, "51f25c41-0", {
          "k": "formDataRef"
        }),
        B: common_vendor.p({
          model: formData.value,
          ["label-width"]: "0",
          rules
        }),
        C: common_vendor.t(opType.value == 0 ? "注册" : "登录"),
        D: common_vendor.o(submitForm),
        E: common_vendor.t(opType.value == 0 ? "已有账号直接登录" : "没有账号去注册"),
        F: common_vendor.o(changeOpType)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-51f25c41"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/account/LoginAndRegister.vue"]]);
wx.createPage(MiniProgramPage);

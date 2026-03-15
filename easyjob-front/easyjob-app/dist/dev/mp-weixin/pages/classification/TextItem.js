"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_Constants = require("../../utils/Constants.js");
if (!Array) {
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_rate2 = common_vendor.resolveComponent("uni-rate");
  (_easycom_uni_data_checkbox2 + _easycom_uni_forms_item2 + _easycom_uni_rate2)();
}
const _easycom_uni_data_checkbox = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms_item = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.js";
const _easycom_uni_rate = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-rate/uni-rate.js";
if (!Math) {
  (uvParse + _easycom_uni_data_checkbox + _easycom_uni_forms_item + _easycom_uni_rate)();
}
const uvParse = () => "../components/uv-parse/components/uv-parse/uv-parse.js";
const _sfc_main = {
  __name: "TextItem",
  props: {
    modelValue: {
      type: [String, Array]
    },
    height: {
      type: Number
    },
    data: {
      type: Object,
      default: {}
    },
    index: {
      type: Number
    },
    showAnswer: {
      type: Boolean,
      default: false
    },
    showHtml: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit }) {
    const props = __props;
    const resetTitle = (data) => {
      return `${data.title}(${utils_Constants.QUESTION_TYPE[data.questionType]})`;
    };
    const formateAnswerOptions = (question) => {
      let options = [];
      if (question.questionType == 0) {
        options = [
          {
            text: "正确",
            value: "1",
            disable: props.showAnswer
          },
          {
            text: "错误",
            value: "0",
            disable: props.showAnswer
          }
        ];
        return options;
      }
      const questionItemList = question.questionItemList;
      for (let i = 0; i < questionItemList.length; i++) {
        options.push({
          text: utils_Constants.LETTER[i] + "、" + questionItemList[i].title,
          value: i + "",
          disable: props.showAnswer
        });
      }
      return options;
    };
    const checkChange = (e) => {
      const value = e.detail.value;
      emit("update:modelValue", value);
      save2Local(value);
    };
    const save2Local = (value) => {
      const data = props.data;
      let examAnswer = common_vendor.index.getStorageSync(utils_Constants.LOCAL_STORAGE_KEY.exam_answer.key);
      if (examAnswer == "") {
        examAnswer = {};
      }
      if (examAnswer[data.textId] == null) {
        examAnswer[data.textId] = {};
      }
      examAnswer[data.textId][data.questionId] = value;
      common_vendor.index.setStorageSync(utils_Constants.LOCAL_STORAGE_KEY.exam_answer.key, examAnswer);
    };
    const getAnswer = (item, answerType) => {
      const answer = answerType == 0 ? item.questionAnswer : item.userAnswer;
      if (answer == null) {
        return "";
      }
      if (item.questionType == 0) {
        return answer == "0" ? "错误" : "正确";
      } else {
        let answerArray = answer;
        if (!(answer instanceof Array)) {
          answerArray = answer.split(",");
        }
        const answerResult = [];
        answerArray.forEach((item2) => {
          answerResult.push(utils_Constants.LETTER[Number.parseInt(item2)]);
        });
        return answerResult.join("、");
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: resetTitle(__props.data),
        b: __props.data.question && __props.showHtml
      }, __props.data.question && __props.showHtml ? {
        c: common_vendor.p({
          content: __props.data.question
        })
      } : {}, {
        d: common_vendor.o(checkChange),
        e: common_vendor.p({
          wrap: true,
          multiple: __props.data.questionType == 2,
          ["model-value"]: __props.modelValue,
          localdata: formateAnswerOptions(__props.data)
        }),
        f: __props.data.questionId,
        g: common_vendor.p({
          name: ["questionList", __props.index, "userAnswer"],
          rules: [{
            required: true,
            errorMessage: "请选择答案"
          }]
        }),
        h: __props.data.answerResult !== 0
      }, __props.data.answerResult !== 0 ? common_vendor.e({
        i: common_vendor.t(getAnswer(__props.data, 0)),
        j: __props.data.answerResult != null && __props.data.answerResult != 0
      }, __props.data.answerResult != null && __props.data.answerResult != 0 ? common_vendor.e({
        k: common_vendor.t(getAnswer(__props.data, 1)),
        l: __props.data.answerResult == 1
      }, __props.data.answerResult == 1 ? {} : {}, {
        m: __props.data.answerResult == 2
      }, __props.data.answerResult == 2 ? {} : {}) : {}) : {}, {
        n: __props.showAnswer
      }, __props.showAnswer ? common_vendor.e({
        o: common_vendor.p({
          size: "20",
          readyonly: true,
          value: __props.data.difficultyLevel,
          activeColor: "#aa6bd9"
        }),
        p: __props.data.answerAnalysis
      }, __props.data.answerAnalysis ? {
        q: common_vendor.p({
          content: __props.data.answerAnalysis
        })
      } : {}) : {}, {
        r: __props.height ? __props.height + "px" : "auto"
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-881feed7"], ["__file", "E:/easyjob/easyjob-front/easyjob-app/src/pages/classification/TextItem.vue"]]);
wx.createComponent(Component);

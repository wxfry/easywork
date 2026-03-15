<template>
  <view>
    <Dialog
      title="问题反馈"
      ref="dialogRef"
      :showCancel="true"
      :okFun="submit"
      okText="提交"
    >
      <uni-forms
        ref="formDataRef"
        :model="formData"
        label-width="0"
        :rules="rules"
      >
        <uni-forms-item name="content">
          <uni-easyinput
            type="textarea"
            v-model="formData.content"
            placeholder="请输入问题"
            :trim="true"
            :maxlength="500"
          >
          </uni-easyinput>
        </uni-forms-item>
      </uni-forms>
    </Dialog>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const formData = ref({});
const formDataRef = ref();
const rules = {
  remark: {
    rules: [{ required: true, errorMessage: "请输入问题" }],
  },
};

const emit = defineEmits(["reload"]);
const submit = () => {
  formDataRef.value.validate(async (errors, value) => {
    if (errors) {
      return;
    }
    const params = Object.assign({}, formData.value);
    console.log("params", params);
    let result = await proxy.Request({
      url: proxy.Api.sendFeedback,
      params: params,
    });
    if (!result) {
      return;
    }
    close();
    emit("reload");
  });
};

const dialogRef = ref();
const show = (data) => {
  dialogRef.value.show();
  nextTick(() => {
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
defineExpose({
  show,
  close,
});
</script>

<style lang="scss" scoped>
</style>

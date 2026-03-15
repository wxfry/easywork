<template>
  <view>
    <Popup type="right" ref="categoryPoupRef">
      <view class="category-list">
        <view
            v-for="item in statusInfo"
            :class="['item', currentStatus == item.valueOf() ? 'active' : '',
            ]"
            @click="selectStatus(item)"
        >
          {{ item.valueOf() }}
        </view>
      </view>
    </Popup>
  </view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const dataSource = ref({});
const loadDataList = async () => {
  let result = await proxy.Request({
    url: proxy.Api.getTextHistory,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  dataSource.value = result.data;
};
loadDataList();

const categoryPoupRef = ref();

const emit = defineEmits(["select"]);

const statusInfo = ref(["全部分类","未完成" ,"已完成"]);
const currentStatus = ref(0);
const show = (status) => {
  currentStatus.value = status;
  categoryPoupRef.value.show();
};
const selectStatus = (item) => {
  currentStatus.value = item.valueOf();
  emit("select", {
    status: item.valueOf(),
  });
  categoryPoupRef.value.close();
};
defineExpose({
  show,
});
</script>

<style lang="scss" scoped>
.category-list {
  .item {
    padding: 10px;
    font-size: 16px;
  }
  .active {
    color: #1a72f4;
  }
}
</style>

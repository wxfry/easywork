<template>
  <view>
    <!-- :showLeft为定义属性-->
    <Navbar :showLeft="showLeft" title="练习历史">
      <!-- 右侧分类插槽 -->
      <template #right>
        <view class="iconfont icon-more-line" @click="showHistoryCategory"></view>
      </template>
    </Navbar>
    <view>
      <view class="question-list">

        <DataList
            :dataSource="dataSrouce"
            @loadData="loadDataList"
            :loadStatus="loadStatus"
        >
          <template #default="{ data }">
            <QuestionItem
                :data="data"
                :status="statusInfo.status"
                :showDetail="true"
            ></QuestionItem>
<!--             传入数据和分类信息-->
          </template>
        </DataList>
      </view>
    </view>
    <QuestionCategory
        ref="historyCategoryRef"
        @select="selectHistoryCategory"
    ></QuestionCategory>
  </view>
</template>

<script setup>
import QuestionCategory from "./HistoryCategory.vue";
import QuestionItem from "./HistoryItem.vue";
import { onLoad } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  showLeft: {
    type: Boolean,
    default: true,
  },
});

const statusInfo = ref( {
  status: "0",
  statusName: "未完成",
})

// 获取数据
const dataSrouce = ref({});
const loadStatus = ref(null);
const loadDataList = async () => { // 获取题目列表信息
  loadStatus.value = "loading";
  let result = await proxy.Request({
    url: proxy.Api.getTextHistory,
    showLoading: false,
    params: {
      // categoryId: categoryInfo.value.categoryId,
      status: statusInfo.value.status,
      pageNo: dataSrouce.value.pageNo || 1,
    },
  });
  if (!result) {
    return;
  }
  loadStatus.value = "more";
  dataSrouce.value = result.data;
};

const historyCategoryRef = ref();
const showHistoryCategory = () => {
  historyCategoryRef.value.show(statusInfo.value);
};

const selectHistoryCategory = (status) => {
  statusInfo.value = Object.assign({}, status);
  loadDataList();
};

onLoad((options) => {
  if (Object.keys(options).length > 0) {
    let { status } = options;
    statusInfo.value = {
      status: status,
      statusName: status === '0' ? '未完成' : '已完成',
    };
  }
  loadDataList();
});
</script>

<style lang="scss" scoped>
.icon-more-line {
  text-align: right;
  font-size: 20px;
}
</style>

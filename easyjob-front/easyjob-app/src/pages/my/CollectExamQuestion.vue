<template>
  <view>
    <Navbar :showLeft="true" title="收藏考题详情"></Navbar>
    <view class="question-list">

      <DataList
        :dataSource="question"
        @loadData="loadDataList"
        :loadStatus="loadStatus"
      >
        <template #default="{ data }">
          <view class="list-item">
            <ExamQuestionItem :showAnswer="true" :data="data" :showHtml="true">
            </ExamQuestionItem>
          </view>
        </template>
      </DataList>

    </view>
  </view>
</template>

<script setup>
import ExamQuestionItem from "@/pages/exam/ExamQuestionItem.vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
// import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
// const route = useRoute();
// const questionId = route.query.questionId;
const questionId = ref('');

onLoad((option) => {
  try {
    // 使用 getCurrentPages 获取参数
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.$page.options || {};
    questionId.value = options.questionId;
    console.log("questionId.value", questionId.value);

    // 确保异步请求错误被捕获
    loadDataList().catch((error) => {
      console.error("Error in loadDataList:", error);
      proxy.Message.error("加载题目失败，请稍后再试");
    });
  } catch (error) {
    console.error("Error in onLoad:", error);
    proxy.Message.error("页面初始化失败，请检查参数");
  }
});

const dataSource = ref({});
const question = ref({
  list: [],
});
const loadStatus = ref(null);
const loadDataList = async () => {
  loadStatus.value = "loading";
  let url = proxy.Api.myCollect;
  let result = await proxy.Request({
    url: url,
    params: {
      pageNo: dataSource.value.pageNo,
      collectType: 2,
    },
  });
  if (!result) {
    return;
  }
  loadStatus.value = "more";
  dataSource.value = result.data;
  console.log("dataSource.value", dataSource.value);

  const _dataSource = dataSource.value.list;
  for(let i=0;i<_dataSource.length;i++) {
    if (_dataSource[i].questionId == questionId.value) {
      question.value.list[0] = _dataSource[i];
      question.value.pageNo = 1;
      question.value.totalCount = 1;
      question.value.pageSize = 1;
      question.value.pageTotal = 1;
      console.log("question.value======", question.value)
    }
  }
};

onLoad(() => {
  loadDataList();
});
onReachBottom(() => {});
</script>

<style lang="scss" scoped>
.question-list {
  padding: 10px;
  .list-item {
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
  }
}
//.question-list {
//  padding: 10px;
//}
</style>

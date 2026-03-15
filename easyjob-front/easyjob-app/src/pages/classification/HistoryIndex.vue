<template>
<!--  <QuestionList :showLeft="false"></QuestionList>-->
  <QuestionList></QuestionList>
</template>

<script setup>
import { onReachBottom } from "@dcloudio/uni-app";
import QuestionList from "./HistoryText.vue";

onReachBottom(() => {});
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="page-pagination" v-if="totalPage>1">
    <template v-if="page==1">
      <img src="@/assets/img/icon/first_disabled.png" width="16">
      <img src="@/assets/img/icon/previous_disabled.png" width="16">
    </template>
    <template v-else>
      <!-- first btn -->
      <img src="@/assets/img/icon/first.png" width="16" class="clickable" @click="turnPage(1)">
      <!-- previous btn -->
      <img src="@/assets/img/icon/previous.png" width="16" class="clickable" @click="turnPage('previous')">
    </template>
    <span class="pageOf">{{page}} <i>/ {{totalPage}}</i></span>
    <template v-if="page==totalPage">
      <img src="@/assets/img/icon/next_disabled.png" width="16">
      <img src="@/assets/img/icon/last_disabled.png" width="16">
    </template>
    <template v-else>
      <!-- next btn -->
      <img src="@/assets/img/icon/next.png" width="16" class="clickable" @click="turnPage('next')">
      <!-- last btn -->
      <img src="@/assets/img/icon/last.png" width="16" class="clickable" @click="turnPage(totalPage)">
    </template>
  </div>
</template>
<script>
export default {
  props:['total','limit','page'],
  computed: {
    totalPage(){//共多少页数据
      if(this.total>0&&this.limit>0){
        return Math.ceil(this.total/this.limit);
      }
      return 0;
    }
  },
  methods: {
    turnPage(num=1){//翻页
      let currentPage = this.page;
      switch (num){
        case 'previous':
          currentPage--;
          break;
        case 'next':
          currentPage++;
          break;
        default:
          currentPage = num;
      }
      this.$emit('emitPage',currentPage)//接口数据page从1开始
    },
  },
}
</script>
<style>
.page-pagination {
  text-align: center;
  padding-top: 20px;
  border-top: var(--border);
  font-size: 12px;
}
.page-pagination img,
.page-pagination span {
  margin-left: 16px;
}
.page-pagination .clickable {
  cursor: pointer;
}
.page-pagination i {
  color: var(--greyColor);
}
</style>

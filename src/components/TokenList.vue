<template>
  <article>
    <router-link v-if="isHome" to="/rank" class="float-right view-all"
      >{{$t('ViewAll')}}</router-link
    >
    <h2 class="title">{{$t('Rank')}}</h2>
    <table-project :isHome="isHome"/>
  </article>
</template>
<script>
import TableProject from '@/components/TableProject.vue';
export default {
  components: { TableProject },
  props: ["isHome"],
};
</script>

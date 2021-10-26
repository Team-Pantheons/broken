<template>
  <section class="container">
    <h2 class="title">{{$t('Voted')}}</h2>
    <table-project :isVoted="true"/>
  </section>
</template>
<script>
import TableProject from '@/components/TableProject.vue';
export default {
  components: { TableProject },
  watch:{
    account(){
      if(!this.account){
        this.$router.push('/');
      }
    }
  }
};
</script>

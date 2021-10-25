<template>
  <section>
    <TokenList class="container"/>
  </section>
</template>
<script>
import TokenList from "@/components/TokenList";
export default {
  components: { TokenList },
  created(){
    if(!this.account){
      this.$router.push('/')
      return false;
    }else{
      this.getList()
    }
  },
  methods:{
    getList(){

    }
  }
};
</script>

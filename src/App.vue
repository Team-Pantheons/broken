<template>
  <div id="app">
    <SideBar v-if="hasSidebar"/>
    <router-view />
  </div>
</template>
<script>
import SideBar from "./components/SideBar";
import { web3Accounts } from "@polkadot/extension-dapp";
export default {
  components: { SideBar },
  data(){
    return {
      hasSidebar:true,
    }
  },
  created(){
    web3Accounts();
    this.$router.afterEach(item => {
      if(item.name=='Submit'){
        this.hasSidebar = false;
      }else{
        this.hasSidebar = true;
      }
    })
  },
};
</script>

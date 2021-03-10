<template>
  <section>
    <main class="container">
      <IndexInfo class="index-info"/>
      <article class="table-responsive card-border" v-if="list&&list.length>0">
        <table>
          <thead>
            <tr>
              <th>Underlying Tokens</th>
              <th>Quantity per Set</th>
              <th>Token Price</th>
              <th>Current Price<br>Allocation</th>
              <th>Percent Change</th>
              <th>Total Price<br>per Set</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,i) in list" :key="i">
              <td class="flex-align-center">
                <img :src="item.img" width="24" @error="iconError">
                <p>{{item.name}}</p>
              </td>
              <td>{{webUtil.addCommas(item.quantityPerSet)}} <span class="color-grey">{{item.name}}</span></td>
              <td>${{webUtil.addCommas(item.price)}}</td>
              <td>{{(item.priceAllocation*100).toFixed(2)}}%</td>
              <td v-if="item.percentChange>=0" class="color-up">+{{(item.percentChange*100).toFixed(2)}}%</td>
              <td v-else class="color-down">{{(item.percentChange*100).toFixed(2)}}%</td>
              <td>${{item.totalPerSet}}</td>
            </tr>
          </tbody>
        </table>
      </article>
      <h4 class="color-grey">About</h4>
      <p class="about-info">The PolkaProject Index is a capitalization-weighted index that tracks the performance of decentralized financial assets across the market.</p>
    </main>
  </section>
</template>
<script>
import IndexInfo from '@/components/IndexInfo'
export default {
  components:{IndexInfo},
  data(){
    return {
      list:null
    }
  },
  created(){
    this.getTokens();
  },
  methods:{
    iconError(e){
      let img = e.srcElement;
      img.src = require('@/assets/img/icon/default-icon.png');
      img.style.boxShadow = 'none';
      img.onerror = null; //防止闪图
    },
    getTokens(){
      this.$loading(1);
      this.axios.get(this.domain+'getPolkaIndexList').then(res=>{
        this.$loading(0);
        if(res.data.success){
          this.list = res.data.data;
        }else{
          this.list = null
        }
      }).catch(err=>{
        console.log(err);
        this.$loading(0);
        this.list = null;
      })
    }
  }
}
</script>
<style scoped>
.table-responsive{
  padding:0 24px;
  margin:32px 0 var(--px48);
}
table span{
  font-size:14px;
}
.index-info+h4{
  margin-top: 32px;
}
.about-info{
  margin-top: 16px;
  font:400 16px/1.25 Rubik-Regular;
}
</style>

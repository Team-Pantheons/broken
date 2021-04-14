<template>
  <section>
    <main class="container">
      <IndexInfo class="index-info"/>
      <article class="table-responsive card-border" v-if="list&&list.length>0">
        <table>
          <thead>
            <tr>
              <th v-html="$t('UnderlyingTokens')"></th>
              <th v-html="$t('QuantityPerSet')"></th>
              <th v-html="$t('TokenPrice')"></th>
              <th v-html="$t('CurrentPriceAllocation')"></th>
              <th v-html="$t('PercentChange')"></th>
              <th v-html="$t('TotalPricePerSet')"></th>
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
      <h4 class="color-grey">{{$t('About')}}</h4>
      <p class="about-info">{{$t('IndexAboutInfo')}}</p>
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
  padding: 0;
  margin:32px 0 var(--px48);
}
table{
  padding:0 24px;
}
table span{
  font-size:14px;
}
.index-info+h4{
  margin-top: 32px;
}
.about-info{
  margin-top: 16px;
  font:400 16px/1.25 var(--familyRegular);
}
</style>

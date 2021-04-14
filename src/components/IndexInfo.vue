<template>
  <article>
    <router-link v-if="isHome" to="/index" class="float-right view-all"
      >{{$t('Details')}}</router-link
    >
    <h2 class="title">
      <img src="@/assets/img/icon/ppi.png" width="32" /><span
        >PolkaProject {{$t('Index')}}</span
      >
    </h2>
    <template v-if="klinePriceList&&klinePriceList.length>1">
      <h1>${{klinePriceList[klinePriceList.length-1]}}
        <span v-if="percentChange>0" class="color-up">+{{(percentChange*100).toFixed(2)}}%</span>
        <span v-else class="color-down">{{(percentChange*100).toFixed(2)}}%</span>
      </h1>
      <h4 class="color-grey">{{klineTimeList[klineTimeList.length-1]}}</h4>
      <KlinePart
        :timeList="klineTimeList"
        :dataList="klinePriceList"
      />
    </template>
    <p v-else class="null"> {{$t('NoInformation')}}</p>
    <ul
      class="select-kline-type" v-if="!isHome">
      <li
        v-for="item in klineType"
        :key="item"
        :class="{ active: selectedKline == item }"
        @click="selectKline(item)"
      >
        {{ $t(item.slice(1)) }}
      </li>
    </ul>
  </article>
</template>
<script>
import KlinePart from "./KlinePart.vue";
export default {
  components: { KlinePart },
  props: ["isHome"],
  data() {
    return {
      klineTimeList: [],
      klinePriceList: [],
      klineType: ["1D", "1W", "1M", "1Y"],
      selectedKline: "1D",
      percentChange:0,
    };
  },
  created() {
    this.getKlineData();
  },
  methods: {
    selectKline(item) {
      this.selectedKline = item;
      this.getKlineData();
    },
    getKlineData() {
      this.axios
        .get(this.domain + "getPolkaIndexCurve?interval=" + this.selectedKline)
        .then((res) => {
          if (res.data.success && res.data.data.list) {
            this.percentChange = res.data.data.percentChange;
            let dataList = res.data.data.list;

            this.klineTimeList = dataList.map((v) => v.showDate);
            this.klinePriceList = dataList.map((v) => v.totalPerSet);
          } else {
            this.klinePriceList = null;
            this.klineTimeList = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.select-kline-type {
  justify-content: space-around;
  padding: 0 40px;
}
.select-kline-type li {
  font: bold 16px/1.5 var(--familyMedium);
  padding: 0;
}
.select-kline-type .active {
  border: none;
}
@media (max-width: 768px) {
  .select-kline-type li {
    font-size: 14px;
  }
}
</style>
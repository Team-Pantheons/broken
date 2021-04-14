<template>
  <p ref="klineDOM" class="kline-echarts"></p>
</template>
<script>
// 引入主模块
import * as echarts from "echarts/core";
import {
    GridComponent,
    GraphicComponent,
    TooltipComponent,
} from 'echarts/components';
import {
    LineChart
} from 'echarts/charts';
import {
    CanvasRenderer
} from 'echarts/renderers';
echarts.use(
    [GraphicComponent,GridComponent,TooltipComponent, LineChart, CanvasRenderer]
);
export default {
  props: ["timeList", "dataList"],
  data(){
    return {
      myChart: null,
    }
  },
  mounted(){
    this.drawKline();
  },
  methods: {
    drawKline() {
      if(!this.timeList||this.timeList.length<1){
        return false;
      }
      //画图
      this.$refs.klineDOM.removeAttribute("_echarts_instance_")
      this.myChart = echarts.init(this.$refs.klineDOM);

      // k线配置
      var option = {
        backgroundColor:"#fff",
        graphic: {
          left: 0,
          bottom: 60,
          type: 'image',
          style: {
            image: require('../assets/img/icon/watermark.png'),
            width:200,
            opacity:0.4,
          }
        },
        color: this.mainColor,
        tooltip: {
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          padding: 12,
          extraCssText: "box-shadow: 0 4px 8px rgba(0,0,0,0.1);",
        },
        xAxis: {
          show:false,
          data: this.timeList,
        },
        yAxis:{
          scale: true,
          show:false,
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 12,
          show: true,
          borderWidth: 0,
        },
        series: [
          {
            type: "line",
            data: this.dataList,
            showSymbol: false,
            lineStyle: {
              width: 2,
            },
            emphasis:{
              lineStyle: {
                width: 2,
              },
            }
          },
        ],
      };
      // 画图
      this.myChart.setOption(option);
      this.myChart.resize();
      this.debouncedKlineResize = this.lodash.debounce(this.myChart.resize, 500)
    },
  },
  watch:{
    dataList(){
      this.drawKline();
    },
    screenWidth(){
      if(this.myChart){
        this.debouncedKlineResize();
      }
    }
  }
};
</script>
<style scoped>
.kline-echarts {
  width: 100%;
  height: 200px;
}
</style>

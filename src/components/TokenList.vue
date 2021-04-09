<template>
  <article>
    <router-link v-if="isHome" to="/rank" class="float-right view-all"
      >{{$t('ViewAll')}}</router-link
    >
    <h2 class="title">{{$t('Rank')}}</h2>
    <main class="table-responsive">
      <table v-if="rankList && rankList.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th
              :class="[{ active: sortByWho == 'title' }]"
              @click="sortRank('title')"
            >
              {{$t('Project')}}
              <img
                v-show="!isHome && title.order == 'asc'"
                src="@/assets/img/icon/up.png"
                width="12"
              />
              <img
                v-show="!isHome && title.order == 'desc'"
                src="@/assets/img/icon/down.png"
                width="12"
              />
            </th>
            <th
              :class="[{ active: sortByWho == 'activity' }]"
              @click="sortRank('activity')"
            >
              <p class="flex-align-center">
                <i><label v-html="$t('DevelopmentActivity')"></label> (30d)</i>
                <img
                  v-show="!isHome && activity.order == 'asc'"
                  src="@/assets/img/icon/up.png"
                  width="12"
                />
                <img
                  v-show="!isHome && activity.order == 'desc'"
                  src="@/assets/img/icon/down.png"
                  width="12"
                />
              </p>
            </th>
            <th v-if="!isHome" v-html="$t('ActivityCurve')"></th>
            <th>{{$t('Token')}}</th>
            <th
              :class="[{ active: sortByWho == 'price' }]"
              @click="sortRank('price')"
            >
              <p class="flex-align-center">
                <i v-html="$t('PriceChange')"></i>
                <img
                  v-show="!isHome && price.order == 'asc'"
                  src="@/assets/img/icon/up.png"
                  width="12"
                />
                <img
                  v-show="!isHome && price.order == 'desc'"
                  src="@/assets/img/icon/down.png"
                  width="12"
                />
              </p>
            </th>
            <th v-if="!isHome">{{$t('Last7Days')}}</th>
            <th
              :class="[{ active: sortByWho == 'like' }]"
              @click="sortRank('like')"
            >
              👍
              <img
                v-show="!isHome && like.order == 'asc'"
                src="@/assets/img/icon/up.png"
                width="12"
              />
              <img
                v-show="!isHome && like.order == 'desc'"
                src="@/assets/img/icon/down.png"
                width="12"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in rankList"
            :key="item.ID"
            @click="goProjectDetail(item)"
          >
            <td>{{ (page-1)*10+i + 1 }}</td>
            <td class="flex-align-center">
              <img
                :src="item.img"
                width="24"
                @error="logoError"
              />
              <div class="td-max-width">
                <p class="text-ellipsis">{{ item.title }}</p>
                <h6 class="color-grey text-ellipsis">
                  <i
                    v-for="(tag, index) in item.tags"
                    :key="index"
                    class="mr-6"
                    >{{ tag }}</i
                  >
                </h6>
              </div>
            </td>
            <td v-if="item.commit30d > 0">
              <p>{{ webUtil.addCommas(item.commit30d) }}</p>
              <h6 v-if="item.commit30dChange >= 0" class="color-up">
                +{{ (item.commit30dChange*100).toFixed(2) }}%
              </h6>
              <h6 v-else class="color-down">{{ (item.commit30dChange*100).toFixed(2) }}%</h6>
            </td>
            <td v-else>--</td>
            <template v-if="!isHome">
              <td v-if="item.devActivitiesList && item.devActivitiesList.length > 9">
                <sparkline
                  :indicatorStyles="spIndicatorStyles"
                  :tooltipStyles="spTooltipStyles"
                  width="80"
                >
                  <sparklineBar
                    :data="item.devActivitiesList"
                    :limit="item.devActivitiesList.length"
                    :styles="spBarStyles"
                    :refLineStyles="spRefLineStyles"
                  />
                </sparkline>
              </td>
              <td v-else></td>
            </template>
            <td>{{ item.alias ? item.alias : "--" }}</td>
            <td v-if="item.price>0">
              <p>${{ webUtil.addCommas(item.price) }}</p>
              <h6 v-if="item.priceChange >= 0" class="color-up">
                +{{ item.priceChange }}%
              </h6>
              <h6 v-else class="color-down">{{ item.priceChange }}%</h6>
            </td>
            <td v-else>--</td>
            <template v-if="!isHome">
              <td v-if="item.priceList && item.priceList.length > 1">
                <sparkline
                  :indicatorStyles="spIndicatorStyles"
                  :tooltipStyles="spTooltipStyles"
                  width="80"
                >
                  <sparklineLine
                    :data="getPriceList(item.priceList)"
                    :limit="item.priceList.length"
                    :styles="spLineStyles"
                    :refLineStyles="spRefLineStyles"
                  />
                </sparkline>
              </td>
              <td v-else></td>
            </template>
            <td>{{ item.like ? webUtil.addCommas(item.like) : "--" }}</td>
          </tr>
        </tbody>
      </table>
      <div class="null" v-else>{{$t('NoInformation')}}</div>
    </main>
    <Pagination
      :total="total"
      :page="page"
      :limit="limit"
      @emitPage="getRank"
      v-if="!isHome"
    />
  </article>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: ["isHome"],
  data() {
    return {
      // sort表示要排序的字段，支持'weight','title', 'activity', 'price', 'like'
      // order=asc升序 order=desc降序
      weight: {
        order: "desc",
      },
      title: {
        order: "desc",
      },
      activity: {
        order: "desc",
      },
      price: {
        order: "desc",
      },
      like: {
        order: "desc",
      },
      sortByWho: "activity",
      sortOrder: "desc",
      total: 10,
      limit: 10, //每页几条数据
      page: 1,
      rankList: null,
    };
  },
  created() {
    if(this.isHome){
      this.getHomeRank()
    }else{
      this.getRank();
    }
  },
  methods: {
    getPriceList(data){
      // 此操作防止改变原数据造成vue渲染死循环
      let price = JSON.parse(JSON.stringify(data))
      return price.reverse();
    },
    goProjectDetail(item) {
      if (item.ID) {
        this.$router.push("/project/" + item.ID);
      }
    },
    sortRank(type) {
      if (this.isHome) {
        return false;
      }
      if (this.sortByWho == type) {
        this[type].order = this[type].order == "desc" ? "asc" : "desc";
      } else {
        this.sortByWho = type;
      }
      this.sortOrder = this[type].order;
      this.getRank();
    },
    getRank(page = 1) {
      this.page = page;
      this.$loading(1);
      this.axios
        .get(
          this.domain+"getPolkaTokenRank?sort="+this.sortByWho+"&order="+this.sortOrder+"&limit=" +
            this.limit +
            "&page=" +page
        )
        .then((res) => {
          this.$loading(0);
          if (res.data.success) {
            this.rankList = res.data.data.list;
            this.total = res.data.data.total;
          }
        })
        .catch((err) => {
          this.rankList = null;
          console.log(err);
          this.$loading(0);
        });
    },
    getHomeRank(){
      this.$loading(1);
      this.axios
        .get(
          this.domain+"getPolkaRankHome?sort=weight&order=desc&limit=10&page=1"
        )
        .then((res) => {
          this.$loading(0);
          if (res.data.success) {
            this.rankList = res.data.data.list;
          }
        })
        .catch((err) => {
          this.rankList = null;
          console.log(err);
          this.$loading(0);
        });
    }
  },
};
</script>
<style scoped>
tr {
  cursor: pointer;
  user-select: none;
}
th img {
  opacity: 0.3;
  margin-left: 4px;
}
th.active img {
  opacity: 1;
}
table td:nth-child(2) {
  max-width: 200px;
}
td:nth-child(2) .td-max-width {
  width: calc(100% - 48px);
}
td:last-child{
  min-width: 20px;
}
</style>

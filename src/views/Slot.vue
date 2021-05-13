<template>
  <section>
    <main class="container">
      <h2 class="title">{{$t('Slot')}}</h2>
      <template
        v-if="
          (auctionList && auctionList.length > 0) ||
          (decList && decList.length > 0) ||
          (cenList && cenList.length > 0)
        "
      >
        <h3 v-if="auctionList && auctionList.length > 0">Kusama Auction</h3>
        <ul class="dapp-list" v-if="auctionList && auctionList.length > 0">
          <li
            class="dapp-info clearfix"
            v-for="project in auctionList"
            :key="project.ID"
            @click="goDetail(project)"
          >
            <img
              v-if="project.img"
              :src="
                'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/polka_project/' +
                project.img
              "
            />
            <img v-else src="@/assets/img/icon/default.png" />
            <div class="dapp-text">
              <h4 class="dapp-title">{{ project.title }}</h4>
              <!-- 邮箱等链接 -->
              <p class="contact">
                <img
                  v-for="(item, i) in getProjectContact(project)"
                  :key="i"
                  :src="require('@/assets/img/tag/' + item + '.png')"
                  @click.stop="openLink(project[item], item)"
                />
              </p>
              <p class="dapp-slogan">{{ project.introduction }}</p>
              <div class="dapp-type">
                <label>{{ cateTitleByID(project) }}</label>
                <template v-if="project.tags.length > 0">
                  <label v-for="(item, index) in project.tags" :key="index"
                    >{{ item }}
                  </label>
                </template>
              </div>
            </div>
          </li>
        </ul>
        <h3 v-if="decList && decList.length > 0">
          Kusama Crowdloan (Decentralized)
        </h3>
        <ul class="dapp-list" v-if="decList && decList.length > 0">
          <li
            class="dapp-info clearfix"
            v-for="project in decList"
            :key="project.ID"
            @click="goDetail(project)"
          >
            <img
              v-if="project.img"
              :src="
                'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/polka_project/' +
                project.img
              "
            />
            <img v-else src="@/assets/img/icon/default.png" />
            <div class="dapp-text">
              <h4 class="dapp-title">{{ project.title }}</h4>
              <!-- 邮箱等链接 -->
              <p class="contact">
                <img
                  v-for="(item, i) in getProjectContact(project)"
                  :key="i"
                  :src="require('@/assets/img/tag/' + item + '.png')"
                  @click.stop="openLink(project[item], item)"
                />
              </p>
              <p class="dapp-slogan">{{ project.introduction }}</p>
              <div class="dapp-type">
                <label>{{ cateTitleByID(project) }}</label>
                <template v-if="project.tags.length > 0">
                  <label v-for="(item, index) in project.tags" :key="index"
                    >{{ item }}
                  </label>
                </template>
              </div>
            </div>
          </li>
        </ul>
        <h3 v-if="cenList && cenList.length > 0">
          Kusama Crowdloan (Centralized)
        </h3>
        <ul class="dapp-list" v-if="cenList && cenList.length > 0">
          <li
            class="dapp-info clearfix"
            v-for="project in cenList"
            :key="project.ID"
            @click="goDetail(project)"
          >
            <img
              v-if="project.img"
              :src="
                'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/polka_project/' +
                project.img
              "
            />
            <img v-else src="@/assets/img/icon/default.png" />
            <div class="dapp-text">
              <h4 class="dapp-title">{{ project.title }}</h4>
              <!-- 邮箱等链接 -->
              <p class="contact">
                <img
                  v-for="(item, i) in getProjectContact(project)"
                  :key="i"
                  :src="require('@/assets/img/tag/' + item + '.png')"
                  @click.stop="openLink(project[item], item)"
                />
              </p>
              <p class="dapp-slogan">{{ project.introduction }}</p>
              <div class="dapp-type">
                <label>{{ cateTitleByID(project) }}</label>
                <template v-if="project.tags.length > 0">
                  <label v-for="(item, index) in project.tags" :key="index"
                    >{{ item }}
                  </label>
                </template>
              </div>
            </div>
          </li>
        </ul>
      </template>
      <p v-else class="null">{{ $t("NoInformation") }}</p>
    </main>
  </section>
</template>
<script>
export default {
  data() {
    return {
      auctionList: null,
      decList: null,
      cenList: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.$loading(1);
      let auctionRes = await this.axios.get(
        this.domain + "getPolkaSlotInfo?tagID=19&parentChain=60"
      );
      let decRes = await this.axios.get(
        this.domain + "getPolkaSlotInfo?tagID=9,20&parentChain=60"
      );
      let cenRes = await this.axios.get(
        this.domain + "getPolkaSlotInfo?tagID=20,21&parentChain=60"
      );

      if (auctionRes.data.success) {
        this.auctionList = auctionRes.data.data;
      }
      if (decRes.data.success) {
        this.decList = decRes.data.data;
      }
      if (cenRes.data.success) {
        this.cenList = cenRes.data.data;
      }
      this.$loading(0);
    },
  },
};
</script>
<style scoped>
.container {
  /* max-width: 900px; */
  /* padding-top: 0; */
}
h3 {
  font: bold 20px/1.4 var(--familyMedium);
  margin: 48px 0 10px;
}
.dapp-list {
  justify-content: space-between;
}
.dapp-list > li {
  padding-left: 0;
  width: 400px;
}
@media (max-width: 768px) {
  h3 {
    margin: 24px 0 8px;
    font-size: 16px;
  }
  .dapp-list > li {
    padding-right: 0;
    width: 100%;
  }
}
</style>
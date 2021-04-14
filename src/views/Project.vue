<template>
  <section class="project-detail container" v-if="project">
    <p class="close" @click="goBackPath">{{$t('Back')}}</p>
    <main class="clearfix">
      <article class="float-left">
        <div class="basic-info clearfix">
          <div class="logo">
            <img
              v-if="project.img"
              :src="
                'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/polka_project/' +
                project.img
              "
              width="96"
              height="96"
            />
            <img
              v-else
              src="@/assets/img/icon/default.png"
              width="96"
              height="96"
            />
          </div>
          <div class="float-left">
            <h4 class="dapp-title">{{ project.title }}</h4>
            <div
              class="dapp-shortdes"
              v-html="webUtil.getFormatCode(project.introduction)"
            ></div>
            <div class="dapp-type">
              <label>{{ cateTitleByID(project) }}</label>
              <template v-if="project.tags.length > 0">
                <label v-for="(item, index) in project.tags" :key="index"
                  >{{ item }}
                </label>
              </template>
            </div>
          </div>
          <!-- 点赞 -->
          <div :class="['like-info',{active:isLiked}]" @click="likeAction">
            <h2>👍</h2>
            <div>
              <p>{{voters?voters.length:'--'}}</p>
              <span>{{$t('Voters')}}</span>
            </div>
          </div>
        </div>
        <!-- 价格曲线 -->
        <div
          class="kline-part"
          v-if="klineTimeList&&klineTimeList.length>0"
        >
          <h2>
            <img
              :src="project.token.img"
              width="24"
              class="mr-6"
              @error="logoError"
            />
            <span>{{ project.token.name }}</span>
          </h2>
          <h2>
            <span class="mr-6">${{ project.token.price }}</span>
            <label
              :class="[
                'percent',
                { 'color-down': project.token.percentChange < 0 },
              ]"
              >{{ project.token.percentChange >0?('+'+project.token.percentChange):project.token.percentChange }}%</label
            >
          </h2>
          <KlinePart :timeList="klineTimeList" :dataList="klinePriceList"/>
          <ul class="select-kline-type">
            <li
              v-for="item in klineType"
              :key="item.name"
              :class="{ active: selectedKline.name == item.name }"
              @click="selectKline(item)"
            >
              {{ $t(item.name.slice(1)) }}
            </li>
          </ul>
        </div>
        <!-- 开发活跃度 -->
        <div class="dev-active flex-between" v-if="project.activity">
          <div class="left-part">
            <h5 v-html="$t('DevelopmentActivity').replace('<br>','')"></h5>
            <ul>
              <li>
                <h2>
                  {{webUtil.addCommas(project.activity.commit30d)}}
                  <span v-if="project.activity.commit30dChange<0" class="color-down">{{(project.activity.commit30dChange*100).toFixed(2)}}%</span>
                  <span v-else class="color-up">+{{(project.activity.commit30dChange*100).toFixed(2)}}%</span>
                </h2>
                <p>{{$t('event')}} (30d)</p>
              </li>
              <li>
                <h2>{{webUtil.addCommas(project.activity.commit90d)}}</h2>
                <p>{{$t('event')}} (90d)</p>
              </li>
            </ul>
          </div>
          <sparkline v-if="project.list&&project.list.length>0" class="sparkline-part" :indicatorStyles="spIndicatorStyles" :tooltipStyles="spTooltipStyles" width="232" height="64">
            <sparklineBar
              :data="project.list"
              :margin="spMargin"
              :limit="project.list.length"
              :styles="spBarStyles"
              :refLineStyles="spRefLineStyles"
            />
          </sparkline>
        </div>
        <div class="about" v-if="project.description">
          <h2>{{$t('About')}} {{ project.title }}</h2>
          <div
            class="dapp-slogan"
            v-html="webUtil.getFormatCode(project.description)"
          ></div>
        </div>
      </article>
      <article class="float-right">
        <!-- 邮箱等链接 -->
        <div class="detail-contact">
          <p
            class="website"
            v-if="project.website"
            @click.stop="openLink(project.website)"
          >
            {{$t("VisitWebsite")}}
          </p>
          <ul>
            <li
              v-for="(item, i) in contactList"
              :key="i"
              @click.stop="openLink(project[item], item)"
            >
              <img :src="require('@/assets/img/tag/' + item + '.png')" />
              <span style="text-transform: capitalize">{{ item }}</span>
            </li>
          </ul>
          <button class="share-btn" @click="copyAction()">{{$t('Share')}}</button>
        </div>
        <!--ParentChain && SubProjects -->
        <ul class="chain-list">
          <li
            class="border-top"
            v-if="
              project.parentChain && Object.keys(project.parentChain).length > 0
            "
          >
            <h2>{{$t('ParentChain')}}</h2>
            <div
              @click="getDetailByID(project.parentChain.ID)"
              class="chain-info"
            >
              <div>
                <img
                  v-if="project.parentChain.img"
                  :src="
                    'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/polka_project/' +
                    project.parentChain.img
                  "
                  width="32"
                  height="32"
                />
                <img
                  v-else
                  src="@/assets/img/icon/default.png"
                  width="32"
                  height="32"
                />
              </div>
              <span>{{ project.parentChain.title }}</span>
            </div>
          </li>
          <li
            class="border-top"
            v-if="project.subProjects && project.subProjects.length > 0"
          >
            <h2>{{$t('SubProjects')}}</h2>
            <div
              v-for="item in project.subProjects"
              :key="item.ID"
              @click="getDetailByID(item.ID)"
              class="chain-info"
            >
              <div>
                <img
                  v-if="item.img"
                  :src="
                    'https://medishares-cn.oss-cn-hangzhou.aliyuncs.com/polka_project/' +
                    item.img
                  "
                  width="32"
                  height="32"
                />
                <img
                  v-else
                  src="@/assets/img/icon/default.png"
                  width="32"
                  height="32"
                />
              </div>
              <span>{{ item.title }}</span>
            </div>
          </li>
        </ul>
        <!-- voters -->
        <div class="border-top" v-if="voters&&voters.length>0">
          <h2>{{voters.length}} {{$t('Voters')}}</h2>
          <p class="voters-list">
            <a v-for="(address,i) in voterList" :key="i" target="_blank" rel="noopener noreferrer" :href="'https://polkadot.subscan.io/account/'+address">{{webUtil.formatStrByDot(address,8,8)}}</a>
            <a v-if="voters.length>10" href="javascript:;" @click="isFold=!isFold">{{isFold?$t('GetMore'):$t('Fold')}}</a>
          </p>
        </div>
      </article>
      <!-- 邮箱订阅 -->
      <article class="float-left">
        <form
          action="https://polkaproject.us2.list-manage.com/subscribe/post?u=0db457fec9c7201e146be45bd&amp;id=b10217625d"
          method="post"
          name="mc-embedded-subscribe-form"
          class="subscribe-update"
          target="_blank"
          novalidate
        >
          <h2>{{$t('SubscribeToUpdates')}}</h2>
          <div class="basic-group">
            <input
              type="email"
              name="EMAIL"
              :placeholder="$t('YourEmail')"
              class="email"
              autocomplete="off"
            />
            <input
              type="submit"
              :value="$t('Subscribe')"
              name="subscribe"
              class="button"
            />
          </div>
        </form>
        <a
          :href="
            'mailto:polkaprojectcom@gmail.com?subject=Update-' + project.title
          "
          class="update-project"
          >{{$t('SubmitThisProject')}}</a
        >
        <p class="color-grey tip">
          {{$t('projectAboutInfo')}}
        </p>
      </article>
    </main>
  </section>
</template>
<script>
import KlinePart from '../components/KlinePart.vue';
export default {
  components: { KlinePart },
  props: ["id"],
  data() {
    return {
      project: null,
      isLiked:false,
      contactList: [],
      klineTimeList:[],
      klinePriceList:[],
      klineType:[{
        type:'5min',
        name:'1D',
        limit:'288'
      },{
        type:'1h',
        name:'1W',
        limit:'168'
      },{
        type:'4h',
        name:'1M',
        limit:'180'
      }],
      selectedKline:{
        type:'5min',
        name:'1D',
        limit:'288'
      },
      USDRmbPrice:'6.48',
      voters:null,
      isFold:true,
      message:'Like this project'
    };
  },
  computed:{
    voterList(){
      return this.voters&&this.voters.length>0&&this.isFold?this.voters.slice(0,10):this.voters
    }
  },
  created() {
    this.getProjectInfo();
  },
  methods: {
    getDetailByID(id){
      this.$router.replace('/project/'+id);
    },
    goBackPath(){
      if(window.history.length>1){
        this.$router.back();
      }else{
        this.$router.push('/projects');
      }
    },
    getProjectInfo() {
      if (this.id) {
        this.$loading(1);
        this.axios
          .get(this.domain + "getProjectById?v=1.0&id=" + this.id)
          .then((res) => {
            this.$loading(0);
            if (res.data.success) {
              this.project = res.data.data;
              this.contactList = this.contact
                .slice(1)
                .filter((v) => this.project[v]);

              if(this.project&&this.project.token){
                this.project.token.price = new this.BigNumber(this.project.token.last2Rmb).div(this.USDRmbPrice).toFormat(4);
              }
              if(this.project.marketID&&this.project.marketID>0){
                this.getKlineData();
              }else{
                this.klineTimeList = null
              }
            }
          })
          .catch((err) => {
            this.$loading(0);
            console.log(err);
          });
          this.getVoters();
      }
    },
    getVoters(){
      this.axios.get(this.domain+'getPolkaLikeVoters?id='+this.id).then(res=>{
        if(res.data.success){
          this.voters = res.data.data&&res.data.data.length>0?res.data.data.reverse():[];
          this.isLiked = this.voters&&this.account?this.voters.includes(this.account.address):false;
        }else{
          this.voters = null;
          this.isLiked = false;
        }
      })
    },
    selectKline(item) {
      this.selectedKline = item;
      this.getKlineData();
    },
    getKlineData() {
      this.axios.get(this.marketDomain+"api/pricePoint?tokenID=" +
          this.project.marketID +
          "&type=" +
          this.selectedKline.type +
          "&limit=" +
          this.selectedKline.limit +
          "&baseCoin=USD").then(res=>{
          if (res.data.success && res.data.data.price) {
            var dataList = res.data.data.price.reverse();
            this.USDRmbPrice = res.data.data.baseCoin.rmb;
            this.project.token.price = new this.BigNumber(
              this.project.token.last2Rmb
            )
              .div(this.USDRmbPrice)
              .toFormat(4);
            this.klineTimeList = dataList.map((v) => v.time);
            this.klinePriceList = dataList.map((v) =>
              new this.BigNumber(v.last2Rmb).div(this.USDRmbPrice).toFixed(4)
            );
          } else {
            this.klinePriceList = null;
          }
        }).catch((err) => {
        console.log(err);
      });
    },
    async likeAction(){
      let account = this.account?this.account:await this.login().catch(err=>{console.log(err)});
      if(this.isLiked){
        return false;
      }
      let signResult = await this.user.signMessage(account,this.message).catch(err=>{console.log(err)})
      const qs = require('qs');
      this.axios.post(this.domain+'polkaProjectLike',qs.stringify({
        address:account.address,
        sign:signResult,
        message:this.message,
        projectID:this.id
      })).then(res=>{
        if(res.data.success){
          this.getVoters();
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  watch:{
    id(){
      this.getProjectInfo();
    },
    account(){
      this.isLiked = this.voters&&this.account?this.voters.includes(this.account.address):false;
    }
  }
};
</script>
<style scoped>
/*详情页*/
.project-detail{
  max-width: unset;
  padding-bottom: 0;
}
.project-detail h2 {
  font: bold 20px/24px var(--familyMedium);
  margin-bottom: 24px;
}

.project-detail .close {
  color: var(--mainColor);
  cursor: pointer;
  user-select:none;
  padding: 32px 44px 12px;
  background:#fff url(../assets/img/icon/back.png)no-repeat 24px 32px/16px;
  position: fixed;
  left: 320px;
  right: 0;
  top: 0;
  z-index:1900;
}

.project-detail main {
  margin: 0 auto;
  max-width: var(--maxWidth);
  padding-bottom: 40px;
}
.float-left{
  max-width: 620px;
  width: 100%;
}
.float-right{
  max-width: 200px;
  width: 100%;
}
.project-detail .logo {
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 2px;
}
.basic-info {
  position: relative;
  padding: 0 0 var(--px48) 120px;
  border-bottom: var(--border);
  margin-bottom: var(--px48);
}
.basic-info .float-left{
  width: calc(100% - 110px);
}
.project-detail .dapp-title {
  word-break: break-word;
  white-space: normal;
  font-size: 24px;
  line-height: 1.2;
}
.project-detail .dapp-slogan {
  display: block;
  word-break: break-word;
  font-size: 16px;
  line-height: 24px;
}
.project-detail .dapp-shortdes {
  color: #000;
  font-size: 14px;
  margin: 0;
}
.project-detail .dapp-type {
  display: flex;
  flex-wrap: wrap;
}
.project-detail .dapp-type label {
  padding: 4px 12px;
  border-radius: 16px;
  border:var(--border);
  margin: 8px 16px 0 0;
}
.detail-contact {
  padding-bottom: var(--px48);
}

.detail-contact .website,.share-btn{
  font: bold 16px/24px var(--familyMedium);
  cursor: pointer;
  display: inline-block;
  border: 1px solid var(--mainColor);
  padding: 12px 24px 12px 52px;
  border-radius: 24px;
}
.detail-contact .website {
  background: var(--mainColor) url(../assets/img/icon/visit.png)no-repeat left 24px center/20px;
  color: #fff;
  margin-bottom: 24px;
}
.share-btn {
  background: url(../assets/img/icon/share.png)no-repeat left 24px center/20px;
  color: var(--mainColor);
}

.detail-contact li {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 24px;
  color: var(--mainColor);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-contact li img {
  width: 24px;
  margin-right: 8px;
}

.detail-contact li:last-child {
  margin-bottom: var(--px48);
}

/* .website+ul li:first-child {
  margin-top: 16px;
} */

.basic-group input.email {
  border-radius: 24px;
  padding: 12px 130px 12px 24px;
}

.basic-group input.button {
  position: absolute;
  right: 4px;
  top: 4px;
  border-radius: 20px;
  padding: 8px 20px;
  width: auto;
  color: #fff;
  background: var(--mainColor);
  text-align: center;
  font: bold 16px/24px var(--familyMedium);
}
.subscribe-update {
  background: var(--paleGrey);
  border-radius: 2px;
  margin-bottom: var(--px48);
  padding: 24px 64px 32px;
  text-align: center;
}
.update-project {
  color: var(--mainColor);
  padding-bottom: var(--px48);
  margin-bottom: var(--px48);
  padding-left: 32px;
  background: url(../assets/img/icon/edit.png) no-repeat left top/24px;
  border-bottom: var(--border);
  display: block;
  font-size: 16px;
  line-height: 24px;
}
.chain-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.chain-info span {
  margin-left: 8px;
}
/* 点赞 */
.like-info{
  float: right;
  padding: 12px 0;
  background: #efeff4;
  border-radius: 2px;
  font-size: 12px;
  width: 88px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  margin-left: 12px;
}
.like-info h2{
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 5px;
}
.like-info p{
  font:bold 14px/16px var(--familyMedium);
}
.like-info.active{
  background: #FFF5FA;
  color:var(--mainColor);
}

/* 价格曲线图 */
.kline-part {
  padding-bottom: 0;
}

.kline-part h2:first-of-type {
  margin-bottom: 16px;
}

.kline-part label {
  font-size: 16px;
  color: #57be42;
}

/* 开发活跃度 */
.dev-active{
  margin-bottom: var(--px48);
  padding: 24px;
  border:var(--border);
  border-radius: 2px;
  flex-wrap: wrap;
  align-items: center;
}
.left-part{
  flex: 1;
}
.sparkline-part{
  width: 232px;
}
.dev-active h5{
  color: var(--greyColor);
  font: bold 14px/16px var(--familyMedium);
  padding-bottom: 16px;
}
.dev-active ul{
  display: flex;
}
.dev-active li{
  width: 50%;
  padding: 8px 16px 0 0;
}
.dev-active h2{
  margin-bottom: 0;
}
.dev-active h2 span{
  font-size: 14px;
}
/* voters */
.voters-list a{
  display: block;
  color:var(--greyColor);
  margin-bottom: 12px;
}
.select-kline-type{
  border-bottom: var(--border);
  margin-bottom: var(--px48) ;
}
.about{
  margin-bottom: var(--px48);
}
@media(max-width: 1220px) {
  .about{
    border-bottom: var(--border);
    padding-bottom: var(--px48);
  }
  .float-left,
  .float-right {
    margin: 0 auto;
    /* width: 100%; */
    max-width: 640px;
    float: none;
  }
  .basic-info .float-left{
    float: left;
  }
}

@media(max-width:992px) {
  .subscribe-update {
    padding: 24px;
  }
}

@media(max-width:768px){
  .project-detail .close{
    left: 0;
    right: 0;
    padding:20px 16px 12px 36px;
    background-position:16px 20px;
  }
  .project-detail .logo img {
    width: 60px;
    height: 60px;
  }
  .basic-info {
    padding: 0 0 24px 70px;
  }
  .project-detail .dapp-title,
  .project-detail h2 {
    font-size: 16px;
  }
  .tip,
  .project-detail .dapp-shortdes,
  .project-detail .dapp-type label {
    font-size: 12px;
  }
  .project-detail .dapp-slogan {
    white-space: normal;
    font-size: 12px;
  }
  .detail-contact ul {
    display: flex;
    flex-wrap: wrap;
  }
  .detail-contact li {
    width: 50%;
    font-size: 14px;
  }
  .share-btn,.detail-contact .website{
    font-size: 14px;
    background-size: 16px;
    background-position: left 16px center;
    padding: 8px 16px 8px 40px;
  }
  /* .website+ul li:nth-child(2) {
    margin-top: 16px;
  } */
  .subscribe-update {
    padding: 16px;
  }
  .sparkline-part{
    margin-top: 16px;
  }
  .basic-info .float-left{
    width: calc(100% - 76px);
  }
  .like-info{
    width: 64px;
    font-size: 10px;
    padding: 8px 0;
  }
  .like-info p{
    font-size: 12px;
  }
}
</style>

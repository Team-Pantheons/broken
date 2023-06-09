import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./assets/js/i18n";
import user from "./assets/js/user";
import axios from "axios";
import lodash from "lodash";
import Toast from "./components/Toast";
import Loading from "./components/Loading";
import LoginModal from "./components/LoginModal";
import VueClipboard from "vue-clipboard2";
import ba from "vue-ba";
import webUtil from "./assets/js/util";
import BigNumber from "bignumber.js";
import Sparklines from "vue-sparklines";
import "./assets/css/index.css";

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(LoginModal);
Vue.use(Sparklines);

// 百度统计
Vue.use(ba, "16aa34879f4d10c06974b0881b309e21");
Vue.use(ba, { siteId: "16aa34879f4d10c06974b0881b309e21" });

import { mapGetters, mapActions } from "vuex";
Vue.mixin({
  data() {
    return {
      lodash: lodash,
      mainColor: "#e6007a",
      user: user,
      webUtil: webUtil,
      BigNumber: BigNumber,
      axios: axios,
      marketDomain: "https://market.maiziqianbao.net/",
      domain: "https://api.staked.xyz/apiPolka/",
      contact: [
        "website",
        "partnership",
        "twitter",
        "telegram",
        "github",
        "job",
        "coinmarketcap",
        "coingecko",
        "element",
        "subsocial",
      ],
      // 指示器样式
      spIndicatorStyles: false,
      spTooltipStyles: null,
      // 折线样式
      spLineStyles: {
        stroke: "#e6007a",
      },
      // margin
      spMargin: 8,
      spBarStyles: {
        fill: "#f7b2d7",
      },
      spRefLineStyles: null,
    };
  },
  computed: {
    ...mapGetters({
      account: "account",
      accountList: "accountList",
      category: "category",
      selectedCategory: "selectedCategory",
      screenWidth: "screenWidth",
    }),
  },
  methods: {
    ...mapActions(["setSelectedCategory", "setAccount", "setAccountList"]),
    logoError(e) {
      let img = e.srcElement;
      img.src = require("@/assets/img/icon/default.png");
      img.style.boxShadow = "none";
      img.onerror = null; //防止闪图
    },
    getProjectContact(project) {
      let c = this.contact.filter((v) => project[v]);
      return c;
    },
    goDetail(project) {
      if (!project) {
        return false;
      }
      this.$router.push("/project/" + project.ID);
    },
    // 复制
    copyAction(val = window.location.href) {
      this.$copyText(val).then(
        () => {
          this.$toast(this.$t("CopySuccess"));
        },
        () => {
          this.$toast(this.$t("CopyFail"));
        }
      );
    },
    openLink(link, type) {
      if (type == "partnership") {
        window.location.href = "mailto:" + link;
      } else {
        window.open(link, "_blank");
      }
    },
    cateTitleByID(project) {
      if (this.category.length > 1) {
        let category = this.category.filter((v) => v.ID == project.cateID)[0];
        return category ? category.title : null;
      }
      return null;
    },
    login() {
      return new Promise((resolve) => {
        this.user
          .getAccounts()
          .then((accountList) => {
            this.setAccountList(accountList);
            // 在麦子钱包中打开自动登录
            if (this.webUtil.browserVersions().mdsApp) {
              if (accountList && accountList.length > 0) {
                this.setAccount(accountList[0]);
                resolve(accountList[0]);
              } else {
                this.$toast(this.$t("noAddress"));
              }
            } else {
              // this.$loginModal( true, accountList, ( account ) => {
              this.$loginModal(true, accountList, this, (account) => {
                if (account) {
                  this.setAccount(account);
                }
                resolve(account);
              });
            }
          })
          .catch((err) => {
            this.$toast(err, 3000);
            this.$loginModal(true);
          });
      });
    },
  },
});

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");

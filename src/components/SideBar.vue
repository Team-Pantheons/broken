<template>
  <section :class="['sidebar-container', { heightAll: isSideShow }]">
    <nav>
      <div class="float-right">
        <img
          :src="
            require('@/assets/img/icon/' +
              (isSideShow ? 'upward.png' : 'menu.png'))
          "
          width="24"
          @click="toggleSidebar(!isSideShow)"
        />
      </div>
      <span>{{
        selectedTab.includes("Project")
          ? selectedCategory.title == "All"
            ? $t("All")
            : selectedCategory.title
          : $t(selectedTab)
      }}</span>
    </nav>
    <article class="sidebar" v-show="isSideShow">
      <div class="logo hidden-xs">
        <img src="@/assets/img/icon/logo.png" height="30" />
      </div>
      <div class="scroll-content">
        <ul class="tabs">
          <li
            :class="{ active: selectedTab == 'Home' && !isMobile }"
            @click="goRoute('Home')"
          >
            <img src="@/assets/img/sidebar/Home.png" width="24" />
            <span>{{ $t("Home") }}</span>
          </li>
          <li
            :class="{ active: selectedTab == 'Index' && !isMobile }"
            @click="goRoute('Index')"
          >
            <img src="@/assets/img/sidebar/Index.png" width="24" />
            <span>{{ $t("Index") }}</span>
          </li>
          <li
            :class="{ active: selectedTab == 'Slot' && !isMobile }"
            @click="goRoute('Slot')"
          >
            <img src="@/assets/img/sidebar/PLO.png" width="24" />
            <span>{{$t('Slot')}}</span>
          </li>
          <li
            :class="{ active: selectedTab == 'Rank' && !isMobile }"
            @click="goRoute('Rank')"
          >
            <img src="@/assets/img/sidebar/Rank.png" width="24" />
            <span>{{ $t("Rank") }}</span>
          </li>
        </ul>
        <div class="flex-between category-title">
          <p>{{ $t("Project") }}</p>
          <router-link to="/submit" class="submit"
            >+ {{ $t("SubmitProject") }}</router-link
          >
        </div>
        <ul class="blockchain">
          <li
            v-for="item in category"
            :key="item.ID"
            @click="switchCategory(item)"
            :class="{
              active:
                selectedCategory.ID == item.ID &&
                !isMobile &&
                selectedTab.includes('Project'),
            }"
          >
            {{ item.title == "All" ? $t("All") : item.title }}
            <span>{{ item.count }}</span>
          </li>
        </ul>
      </div>
      <div class="fixed-bottom">
        <div class="dropdown">
          <button v-if="!account" class="border-btn" @click="login">
            {{ $t("Login") }}
          </button>
          <a
            v-else
            :class="['border-btn', { open: accountDropdownShow }]"
            @click="accountDropdownShow = !accountDropdownShow"
          >
            <span>{{ webUtil.formatStrByDot(account.address) }}</span>
            <img src="@/assets/img/icon/downward_white.png" width="16" />
          </a>
          <a
            href="javascript:;"
            class="dropdown-menu"
            v-show="accountDropdownShow"
            @click="logoutAction"
          >
            {{ $t("Logout") }}
          </a>
        </div>

        <div class="foot-contact flex-between-center">
          <p>
            <a href="https://t.me/polkaprojectcom" target="_blank"
              ><img src="@/assets/img/icon/telegram.png" width="20"
            /></a>
            <a href="https://twitter.com/polkaprojectcom" target="_blank"
              ><img src="@/assets/img/icon/twitter.png" width="20"
            /></a>
            <a href="javascript:;">
              <img src="@/assets/img/icon/wechat.png" width="20" />
              <img
                class="qrcode"
                src="@/assets/img/sidebar/weixin.jpg"
                width="140"
              />
            </a>
            <a
              href="https://github.com/PolkaProject/PolkaProject-frontend"
              target="_blank"
              ><img src="@/assets/img/icon/github.png" width="20"
            /></a>
            <a href="https://polkaproject.medium.com/" target="_blank"
              ><img src="@/assets/img/icon/medium.png" width="20"
            /></a>
          </p>
          <div class="dropdown language">
            <a
              href="javascript:;"
              @click="isLangShow = !isLangShow"
              :class="{ open: isLangShow }"
            >
              <span>{{ $t("lang") }}</span
              ><img src="@/assets/img/icon/downward_white.png" width="12" />
            </a>
            <ul class="dropdown-menu" v-show="isLangShow">
              <li @click="switchLang('cn')">简体中文</li>
              <li @click="switchLang('en')">English</li>
              <li @click="switchLang('ru')">Pусский</li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isMobile: false, //是否为移动端
      isSideShow: false, //侧边栏是否显示
      accountDropdownShow: false, //账号下拉框是否显示
      selectedTab: "Home",
      isLangShow: false,
    };
  },
  created() {
    this.getCategory();
    // 侧边栏显示与否
    this.toggleSidebar();
    this.debouncedToggleSidebar = this.lodash.debounce(this.toggleSidebar, 200);
    // 在麦子钱包中打开自动登录
    if (this.webUtil.browserVersions().mdsApp) {
      this.login();
    }
  },
  mounted() {
    window.onresize = () => {
      this.debouncedToggleSidebar();
      this.setScreenWidth(window.innerWidth);
    };
  },
  methods: {
    ...mapActions(["setCategory", "logout", "setScreenWidth"]),
    toggleSidebar(n = 0) {
      if (window.innerWidth <= 768) {
        this.isMobile = true;
        if (n == 1) {
          this.isSideShow = true;
        } else {
          this.isSideShow = false;
        }
      } else {
        this.isMobile = false;
        this.isSideShow = true;
      }
    },
    switchLang(lang) {
      //切换语言
      this.$i18n.setUserLanguage(lang);
      this.isLangShow = false;
      this.toggleSidebar();
    },
    goRoute(item) {
      this.toggleSidebar();
      this.selectedTab = item;
      if (this.$route.name != item) {
        this.$router.push({ name: item });
      }
    },
    //切换链
    switchCategory(item) {
      this.setSelectedCategory(item);
      this.selectedTab = "Projects";
      if (this.$route.fullPath != "/projects?cateID=" + item.ID + "&tagID=0") {
        this.$router.push("/projects?cateID=" + item.ID + "&tagID=0");
      }
      this.toggleSidebar();
    },
    getCategory() {
      this.axios.get(this.domain + "getCategory").then((res) => {
        if (res.data.success) {
          let category = [
            {
              ID: 0,
              title: "All",
              count: "",
            },
          ];

          category[0].count = res.data.data.category.reduce((sum, v) => {
            sum += v.count;
            return sum;
          }, 0);

          category = category
            .concat(res.data.data.category)
            .sort(function (a, b) {
              return a.ID - b.ID;
            });

          this.setCategory(category);
        } else {
          console.log(res.data.data.message);
        }
      });
    },
    logoutAction() {
      this.logout();
      this.accountDropdownShow = false;
    },
  },
  watch: {
    $route(to) {
      if (to.path != "/submit") {
        this.selectedTab = to.name;
      }
    },
  },
};
</script>
<style scoped>
/*侧边导航*/
.sidebar-container {
  width: 320px;
  float: left;
  color: #fff;
}
.sidebar-container a {
  color: #fff;
}
nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 48px;
  padding: 12px 16px;
  font: bold 16px/24px var(--familyMedium);
  background: var(--mainColor);
  z-index: 1100;
  display: none;
}
.sidebar {
  background: var(--mainColor);
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1010;
}
.sidebar .logo {
  padding: 17px 24px;
}
.scroll-content {
  height: calc(100% - 186px);
  overflow-y: auto;
  overflow-x: hidden;
}
.scroll-content li {
  padding: 12px 24px;
  font: bold 18px/24px var(--familyMedium);
  cursor: pointer;
}
.scroll-content li img {
  margin-right: 12px;
}
.scroll-content li.active {
  background: var(--blackOp);
  position: relative;
}
.category-title {
  font: bold 14px/16px var(--familyMedium);
  padding: 36px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin-top: 24px;
}
.blockchain li {
  padding: 12px 24px 12px 60px;
}
.blockchain li span {
  font-size: 14px;
  margin-left: 4px;
  vertical-align: baseline;
}
.blockchain li.active:before {
  content: "";
  position: absolute;
  left: 24px;
  top: 20px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

/*滚动条样式*/

.scroll-content::-webkit-scrollbar {
  width: 6px;
}

.scroll-content::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: var(--whiteOp);
}

.fixed-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 24px 24px;
}
.fixed-bottom a {
  display: inline-block;
}
.border-btn {
  font: bold 16px/16px var(--familyMedium);
  color: #fff;
  border: 1px solid #fff;
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
}
.fixed-bottom img {
  margin-right: 16px;
}
.dropdown {
  position: relative;
  margin-bottom: 24px;
  display: inline-block;
}
.dropdown img {
  margin: 0 0 0 4px;
}
.language {
  margin-bottom: 0;
  font: 700 16px/1 var(--familyMedium);
}
.open img {
  transform: rotate(180deg);
}

.dropdown .dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 46px;
  background: #fff;
  color: #000;
  border-radius: 16px;
  padding: 8px 0;
  z-index: 200;
  text-align: center;
  max-width: 204px;
  font: 700 16px/1.5 var(--familyMedium);
}
.language .dropdown-menu {
  width: 110px;
  left: auto;
  bottom: 32px;
}
.language li {
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}
.foot-contact a {
  position: relative;
}
.foot-contact .qrcode {
  position: absolute;
  left: 0;
  bottom: 24px;
  display: none;
  opacity: 1;
}
.foot-contact a:hover .qrcode {
  display: block;
}
@media (max-width: 768px) {
  nav {
    display: block;
  }
  nav:after,
  .category-title:after {
    content: "";
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 16px;
    right: 16px;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.5);
  }
  .category-title:after {
    top: 0;
    bottom: auto;
  }
  .sidebar-container {
    width: 100vw;
  }
  .scroll-content {
    height: calc(100% - 130px);
    overflow: auto;
  }
  .scroll-content li {
    font-size: 16px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.7);
  }
  .sidebar,
  .sidebar a {
    color: rgba(255, 255, 255, 0.7);
  }
  .scroll-content li img {
    opacity: 0.7;
  }
  .category-title {
    padding: 24px 16px 12px;
    border: none;
    position: relative;
    color: #fff;
  }
  .category-title a {
    color: #fff;
  }
  .tabs li {
    padding: 12px 16px;
  }
  .blockchain li {
    padding-left: 52px;
  }
  .login-container {
    left: 0;
    padding: 16px;
  }
  .fixed-bottom {
    padding: 12px 16px 34px;
  }
  .fixed-bottom a {
    color: #fff;
  }
}
</style>

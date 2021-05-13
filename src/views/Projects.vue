<template>
  <section>
    <!-- tag导航 -->
    <header ref="header">
      <div class="search-box">
        <input
          type="text"
          class="search"
          :placeholder="$t('Search')"
          v-model="searchInfo"
          @input="debouncedSearchProject"
        />
        <img
          src="@/assets/img/icon/close.png"
          width="16"
          class="close-btn"
          v-show="searchInfo"
          @click="emptySearch"
        />
      </div>
      <ul class="labels" v-if="tags.length > 0">
        <li
          v-for="tag in tags"
          :key="tag.ID"
          :class="{ active: selectedTagID == tag.ID }"
          @click="switchTags(tag)"
        >
          {{ tag.title=="All"?$t('All'):tag.title }}
        </li>
      </ul>
    </header>
    <!-- 项目列表 -->
    <div class="main" ref="projectList" @scroll="getMore">
      <ul class="dapp-list" ref="dappList" v-if="projectList.length > 0">
        <li
          class="dapp-info clearfix"
          v-for="project in projectList"
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
      <!-- 无结果 -->
      <div v-else-if="searchInfo" class="noSearchResult">
        <p>{{$t('NoResultsFound').replace('w%',searchInfo)}}</p>
        <br />
        <p v-html="$t('NoResultsInfo')"></p>
      </div>
      <div class="load-all" v-if="isAllList"><span>{{$t('NoMore')}}</span></div>
    </div>
    <!-- go top -->
    <img
      class="goTop"
      src="@/assets/img/icon/goTop.png"
      width="40"
      v-if="isBack"
      @click="goTop"
    />
  </section>
</template>
<script>
export default {
  props: ["cateID", "tagID"],
  data() {
    return {
      isAllList: false, //是否获得全部数据
      isBack: false, //是否显示返回顶部按钮
      projectList: [], //项目列表
      tags: [], //项目标签
      page: 0,
      selectedTagID: 0, //所选标签
      searchInfo: "",
      limit_num: window.innerWidth <= 768 ? 10 : 71,
      sw: false,
    };
  },
  created() {
    this.getListByCateTag();
    //`_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    this.debouncedSearchProject = this.lodash.debounce(this.searchProject, 500);
    this.debouncedsetDomLimit = this.lodash.debounce(this.setDomLimit, 500);
  },
  computed: {
    tagList() {
      let list = this.tags.map((v) => v.ID);
      return list;
    },
  },
  mounted() {
    this.setDomLimit();
  },
  methods: {
    goDetail(project) {
      if (!project) {
        return false;
      }
      this.$router.push("/project/" + project.ID);
    },
    setDomLimit() {
      if (window.innerWidth <= 768) {
        //设置每次请求数量
        this.limit_num = 10;
        //设置项目内容高度
        this.$refs.projectList.style.height =
          window.innerHeight - this.$refs.header.offsetHeight - 48 + "px";
      } else {
        this.limit_num = 71;
        this.$refs.projectList.style.height =
          window.innerHeight - this.$refs.header.offsetHeight + "px";
      }
    },
    switchTags(tag) {
      if(this.$route.fullPath!="/projects?cateID=" + this.selectedCategory.ID + "&tagID=" + tag.ID){
        this.$router.push(
          "/projects?cateID=" + this.selectedCategory.ID + "&tagID=" + tag.ID
        );
      }
    },
    // 通过路由category变化请求数据
    getListByCateTag() {
      let selectedCate = { ID: 0, title: "All" };
      if (this.category && this.category.length > 0) {
        let item = this.category.filter((v) => v.ID == this.cateID)[0];
        selectedCate = item ? item : selectedCate;
      }
      this.setSelectedCategory(selectedCate);
      this.getTags();
    },
    getListByTag() {
      this.selectedTagID = this.tagList.includes(this.tagID) ? this.tagID : "0";
      this.getList();
    },
    getTags() {
      this.$loading(1);
      //获取标签列表
      var URL =
        this.domain +
        "getTags" +
        (this.selectedCategory.ID ? "?cateID=" + this.selectedCategory.ID : "");
      this.tags = [
        {
          ID: "0",
          title: "All",
        },
      ];
      this.axios
        .get(URL)
        .then((res) => {
          if (res.data.success) {
            this.tags = this.tags.concat(res.data.data.tags);
          }
          this.getListByTag();
        })
        .catch((err) => {
          this.getListByTag();
          console.log(err);
        });
    },
    getList() {
      //获取项目列表
      var URL = "";
      this.$loading(1);
      this.page = 0;
      if (this.$refs.projectList) {
        this.$refs.projectList.scrollTo(0, 0);
      }
      this.searchInfo = this.searchInfo.trim();
      if (this.searchInfo) {
        URL =
          this.domain +
          "searchPolka?key=" +
          this.searchInfo +
          "&tagID=" +
          this.selectedTagID;
      } else {
        URL =
          this.domain +
          "getPolkaList?limit=" +
          this.limit_num +
          "&tagID=" +
          this.selectedTagID +
          "&page=0" +
          (this.selectedCategory.ID
            ? "&cateID=" + this.selectedCategory.ID
            : "");
      }

      // 首次请求数据
      this.axios.get(URL).then((res) => {
        this.$loading(0);
        if (res.data.success) {
          this.projectList = res.data.data.polkas;
          this.isAllList = false;
          // 将开关关闭
          this.sw = false;
          // 搜索框有数据
          if (this.searchInfo) {
            if (this.projectList && this.projectList.length > 0) {
              this.isAllList = true;
            }
          } else {
            if (this.projectList.length < this.limit_num) {
              this.isAllList = true;
            } else {
              this.sw = true;
            }
          }
        } else {
          console.log(res.data.message);
        }
      });
    },
    searchProject() {
      //搜索项目
      this.$loading(1);
      this.$refs.projectList.scrollTo(0, 0);
      this.searchInfo = this.searchInfo.trim();
      if (!this.searchInfo) {
        this.getList();
        return false;
      }
      this.sw = false;
      var URL =
        this.domain +
        "searchPolka?key=" +
        this.searchInfo +
        "&tagID=" +
        this.selectedTagID;

      this.axios.get(URL).then((res) => {
        this.$loading(0);
        if (res.data.success) {
          this.projectList = res.data.data.polkas;
          if (this.projectList && this.projectList.length > 0) {
            this.isAllList = true;
          } else {
            this.isAllList = false;
          }
        } else {
          console.log(res.data.message);
        }
      });
    },
    emptySearch() {
      //清空搜索框
      this.searchInfo = "";
      this.getList();
    },
    getMore() {
      // 返回顶部按钮
      if (
        this.$refs.projectList.scrollTop > this.$refs.projectList.offsetHeight
      ) {
        this.isBack = true;
      } else {
        this.isBack = false;
      }

      // 滚动加载更多
      if (!this.searchInfo.trim()) {
        // 判断是否打开开关
        if (this.sw == true) {
          // 判断是否滚动到底部
          if (
            this.$refs.dappList.offsetHeight -
              this.$refs.projectList.scrollTop <=
            this.$refs.projectList.offsetHeight
          ) {
            this.page++;
            this.$loading(1);
            // 将开关关闭
            this.sw = false;

            var URL =
              this.domain +
              "getPolkaList?limit=" +
              this.limit_num +
              "&tagID=" +
              this.selectedTagID +
              "&page=" +
              this.page +
              (this.selectedCategory.ID
                ? "&cateID=" + this.selectedCategory.ID
                : "");

            this.axios.get(URL).then((res) => {
              if (res.data.success) {
                this.$loading(0);
                if (res.data.data.polkas.length > 0) {
                  this.projectList = this.projectList.concat(
                    res.data.data.polkas
                  );
                }
                // 数据更新完毕，将开关打开
                if (res.data.data.polkas.length < this.limit_num) {
                  this.isAllList = true;
                  this.sw = false;
                } else {
                  this.isAllList = false;
                  this.sw = true;
                }
              } else {
                console.log(res.data.message);
              }
            });
          }
        }
      }
    },
    goTop() {
      this.$refs.projectList.scrollTo(0, 0);
    },
  },
  watch: {
    screenWidth() {
      this.debouncedsetDomLimit();
    },
    limit_num() {
      this.getList();
    },
    cateID() {
      this.getListByCateTag();
    },
    tagID() {
      this.getListByTag();
    },
  },
};
</script>

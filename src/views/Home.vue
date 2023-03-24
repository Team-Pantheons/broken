<template>
  <section>
    <main class="container">
      <IndexInfo isHome="1" class="card-border mb-48" />
      <a
        href="https://collectify.app?utm_source=polkaproject"
        class="adv"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          
          <p class="mt-12">Broken enabling realworld business to initiates partnership by booking sessions, all-in-one application</p>
        </div>
       
      </a>
      <TokenList isHome="1" class="card-border" />
    </main>
  </section>
</template>

<script>
import IndexInfo from "@/components/IndexInfo";
import TokenList from "@/components/TokenList";
export default {
  components: { IndexInfo, TokenList },
};
</script>
<style scoped>
.adv {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: url(../assets/img/adv/bg.png) no-repeat center/cover;
  margin-bottom: var(--px48);
  color: #fff;
  padding: 24px 24px 32px;
  border-radius: 4px;
  font-size: 20px;
  line-height: 1.25;
}
.mt-12 {
  margin-top: 16px;
}
.mb-48 {
  margin-bottom: var(--px48);
}
@media(max-width:768px){
  .adv{
    font-size: 16px;
    line-height: 22px;
    padding: 20px 16px 24px;
  }
  .adv .logo{
    height: 24px;
  }
  .adv .link{
    height: 16px;
  }
}
/* 
.banner{
  margin-bottom: 40px;
  flex-wrap: wrap;
}
.banner li{
  width: 49%;
}
.banner a{
  display: block;
  padding: 28px 24px;
  color: #fff;
  border-radius: 4px;
}
.banner li:first-child a{
  background: var(--mainColor) url(../assets/img/banner/project.png)no-repeat right bottom/auto 100%;
}
.banner li:nth-child(2) a{
  background: #000 url(../assets/img/banner/PLO.png)no-repeat right bottom/auto 100%;
}
.banner .title{
  border:none;
  padding-bottom: 8px;
}
.banner h4{
  margin-bottom: 0;
}
.banner img{
  margin-left: 8px;
} */

/* @media(max-width: 996px) {
  .banner li{
    width: 100%;
  }
  .banner li:last-child{
    margin-top: 24px;
  }
} */
</style>

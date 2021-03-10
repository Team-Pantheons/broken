<template>
  <section>
    <main class="container">
      <IndexInfo isHome="1" class="card-border  mb-40"/>
      <TokenList isHome="1" class="card-border"/>
    </main>
  </section>
</template>

<script>
import IndexInfo from '@/components/IndexInfo'
import TokenList from '@/components/TokenList'
export default {
  components:{IndexInfo,TokenList},
}
</script>
<style scoped>
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
}
.mb-40{
  margin-bottom: 40px;
}
@media(max-width: 996px) {
  .banner li{
    width: 100%;
  }
  .banner li:last-child{
    margin-top: 24px;
  }
}
</style>

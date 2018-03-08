<template>
  <div class="page">
      <div class="pageInner pos_rel">
          <div class="loading pos_abs" v-if = "isLoading">
              加载中,请稍候....(已加载{{progress}}%)
          </div>
          <div class="mainCont pos_rel" v-if ="!isLoading">
              <div class="pos_abs animate1 animate">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171024/shuoming.png?sdfds">
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import mixin from '@/mixin/'
export default {
  name: 'fop',
  mixins:[mixin],
  data () {
    return {
      imgs:['http://n.sinaimg.cn/ah/865fe30d/20171024/shuoming.png?sdfds'],
      isLoading:true,
      progress:0,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page{
    background:url(http://n.sinaimg.cn/ah/865fe30d/20171023/2.jpg) no-repeat center top;
    background-size: 100% auto;
  }
  .animate1{
    width: 6.23rem;
    top:0rem;
    left: 0.1rem;
    /* opacity: 0;
    -webkit-animation:flipInX 1s ease-out .5s forwards; */
  }
</style>

<template>
  <div class="page">
      <div class="pageInner pos_rel">
          <div class="loading pos_abs" v-if = "isLoading">
              加载中,请稍候....(已加载{{progress}}%)
          </div>
          <div class="mainCont pos_rel" v-if ="!isLoading">
              <span class="pos_abs animate1 animate">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/logo1.png">
              </span>
              <span class="pos_abs animate2 animate">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/1.png">
              </span>
              <router-link class="pos_abs animate3 animate" to="/tp">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/PaiXing.png">
              </router-link>
              <router-link class="pos_abs animate5 animate" to="/fop">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/ShuoMing.png">
              </router-link>
              <div class="pos_abs animate4 animate" to="/sp" @click="toAndPlay">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/KaiShi.png">
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import mixin from '@/mixin/'
export default {
  name: 'fp',
  mixins:[mixin],
  data () {
    return {
      imgs:["http://n.sinaimg.cn/ah/865fe30d/20171023/1.jpg","http://n.sinaimg.cn/ah/865fe30d/20171023/1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/logo1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/KaiShi.png","http://n.sinaimg.cn/ah/865fe30d/20171023/PaiXing.png","http://n.sinaimg.cn/ah/865fe30d/20171023/ShuoMing.png"],
      isLoading:true,
      progress:0,
    }
  },
  methods :{
    toAndPlay(){
      window.vueChildren=this;
      this.$parent.playAudio('m1');
      // this.$emit('play-music','m1');
      this.$router.push({path:'/sp'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page{
    background:url(http://n.sinaimg.cn/ah/865fe30d/20171023/1.jpg) no-repeat center top;
    background-size: 100% auto;
  }
  .animate1{
    width: 3.37rem;
    top:0.88rem;
    left: 1.52rem;
    opacity: 0;
    -webkit-animation:flipInX 1s ease-out .5s forwards;
  }
  .animate2{
    width: 5.95rem;
    top:1.88rem;
    left: 0.2rem;
    opacity: 0;
    -webkit-animation:zoomIn .5s ease-out 1s forwards;
  }
  .animate3{
    width:1.6rem;
    top:7.9rem;
    left: 0.3rem;
    opacity: 0;
    -webkit-animation:bounceIn .5s ease-out 1.3s forwards;
  }
  .animate4{
    width:1.98rem;
    top:7.68rem;
    left: 2.18rem;
    opacity: 0;
    -webkit-animation:bounceIn .5s ease-out 1.6s forwards;
  }
  .animate5{
    width:1.58rem;
    top:7.92rem;
    left: 4.5rem;
    opacity: 0;
    -webkit-animation:bounceIn .5s ease-out 1.9s forwards;
  }
</style>

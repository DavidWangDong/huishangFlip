<template>
  <div class="page">
      <div class="pageInner pos_rel">
          <div class="loading pos_abs" v-if = "isLoading">
              加载中,请稍候....(已加载{{progress}}%)
          </div>
          <div class="mainCont pos_rel" v-if ="!isLoading">
              <span class="pos_abs animate1 animate">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/logo1.png?ffgg">
              </span>
              <span class="pos_abs animate2 animate">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/1.png?ffggtt">
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

              <span class="pos_abs animate6 animate star">
                  <img src="http://n.sinaimg.cn/ah/865fe30d/20180315/stars1.png" alt="">
              </span>

               <span class="pos_abs animate7 animate star">
                  <img src="http://n.sinaimg.cn/ah/865fe30d/20180315/stars2.png" alt="">
              </span>

              <span class="pos_abs animate8 animate star">
                  <img src="http://n.sinaimg.cn/ah/865fe30d/20180315/stars3.png" alt="">
              </span>

              <span class="pos_abs animate9 animate star">
                  <img src="http://n.sinaimg.cn/ah/865fe30d/20180315/stars4.png" alt="">
              </span>

               <span class="pos_abs animate10 animate star">
                  <img src="http://n.sinaimg.cn/ah/865fe30d/20180315/stars5.png" alt="">
              </span>
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
      imgs:["http://n.sinaimg.cn/ah/865fe30d/20171023/1.jpg","http://n.sinaimg.cn/ah/865fe30d/20171023/1.png?ffggtt","http://n.sinaimg.cn/ah/865fe30d/20171023/logo1.png?ffgg","http://n.sinaimg.cn/ah/865fe30d/20171023/KaiShi.png","http://n.sinaimg.cn/ah/865fe30d/20171023/PaiXing.png","http://n.sinaimg.cn/ah/865fe30d/20171023/ShuoMing.png"],
      isLoading:true,
      progress:0,
    }
  },
  mounted () {
    
  },
  methods :{
    toAndPlay(){
      window.vueChildren=this;
      this.$parent.playAudio('bgAudio2')
      this.$parent.playAudio('m1');
      // this.$emit('play-music','m1');
      this.$router.push({path:'/sp'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@-webkit-keyframes swing1 {
  0% {-webkit-transform: rotate(0);}
  100%{opacity: 1; -webkit-transform: rotate(359deg);}
}
  .page{
    background:url(http://n.sinaimg.cn/ah/865fe30d/20171023/1.jpg) no-repeat center top;
    background-size: 100% auto;
  }
  .animate1{
    width: 3.89rem;
    top:0.84rem;
    left: 1.22rem;
    opacity: 0;
    -webkit-animation:flipInX 1s ease-out .5s forwards;
  }
  .animate2{
    width: 6.5rem;
    top:1.82rem;
    left: -0.1rem;
    opacity: 0;
    -webkit-animation:zoomIn .5s ease-out 1s forwards;
    z-index:8;
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
  .animate6{
    width:1.77rem;
    top:1.64rem;
    left: 0.76rem;
    -webkit-animation:zoomIn .5s ease-out 1.9s forwards;
    opacity:0;
    z-index:2;
  }

  .animate7{
    width:0.95rem;
    top:2.46rem;
    left: 0.56rem;
    -webkit-animation:zoomIn .5s ease-out 2.2s forwards;
    opacity:0;
    z-index:3;
  }
  .animate8{
    width:1.08rem;
    top:2.12rem;
    left: 3.76rem;
    -webkit-animation:zoomIn .5s ease-out 2.5s forwards;
    opacity:0;
    z-index:3;
  }

  .animate9{
    width:.8rem;
    top:2.62rem;
    left: 4.84rem;
    -webkit-animation:zoomIn .5s ease-out 2.8s forwards;
    opacity:0;
    z-index:3;
  }

   .animate10{
    width:.55rem;
    top:2.18rem;
    left: 4.78rem;
    -webkit-animation:zoomIn .5s ease-out 3.1s forwards;
    opacity:0;
    z-index:6;
  }
  .animate6 img{
    -webkit-animation:swing1 3s linear .5s infinite forwards;
  }
  .animate7 img{
    -webkit-animation:rubberBand  1.5s ease-out .5s infinite forwards alternate;
  }
  .animate8 img{
    -webkit-animation:tada   1.3s ease-out .5s infinite forwards alternate;
  }
  .animate9 img{
    -webkit-animation:flash    2s ease-out .5s infinite forwards alternate;
  }
  .animate10 img{
    -webkit-animation:scale    1.6s ease-out .5s infinite forwards alternate;
  }
</style>

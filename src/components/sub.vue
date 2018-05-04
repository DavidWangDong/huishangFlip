<template>
  <div class="page">
      <div class="pageInner pos_rel">
          <div class="loading pos_abs" v-if = "isLoading">
              加载中,请稍候....(已加载{{progress}}%)
          </div>
          <div class="mainCont pos_rel" v-if ="!isLoading">
              <div class="pos_abs animate animate1">
                  <img :src="!isForbiden?'http://n.sinaimg.cn/ah/865fe30d/20171024/subBg.png':'http://n.sinaimg.cn/ah/865fe30d/20180503/sub_succ.png'" alt="">
                  <div class="prizeCont pos_abs">
                      本次总用时:
                      {{Math.floor($route.query.time/1000)}}'{{$route.query.time%1000}}
                  </div>
                  <input placeholder="输入手机号查看排行" type="text" v-model="userPhone" class="pos_abs userphone" v-if="!isForbiden">
                  <div class="btnList pos_abs">
                      <div class="subBtn animate" v-if="!isForbiden" @click="subPhone">
                          <img src="http://n.sinaimg.cn/ah/865fe30d/20171024/TiJiao.png" alt="">
                      </div>
                      <div class="listBtn" v-else>
                          <div class="hasSub animate" v-if="!isForbiden">
                              <img src="http://n.sinaimg.cn/ah/865fe30d/20171024/YiTiJiao.png" alt="">
                          </div>
                          <router-link class="resStart animate" to="/">
                              <img src="http://n.sinaimg.cn/ah/865fe30d/20171024/ZhongXinWan.png" alt="">
                          </router-link>
                      </div>
                  </div>
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
  created (){
      let openId = window.wx_id;
      $.ajax({
          url:'http://ahfensitong.com/huishang/fanpai/api.php?action=getMobile',
          type:'GET',
          data:{openid:openId,jsonp:1},
          dataType:'jsonp',
          success:(data)=>{
              if (data.error!=0){
                  alert('网络错误!');
                  return;
              }
              if (data.data=='NO'||data.data==''){
                  this.userPhone='';
                  this.isForbiden=false;
              }else{
                  this.userPhone=data.data;
                  this.isForbiden=true;
              }
          }
      })
  },
  methods:{
      subPhone(){
          let reg = /^1[356487]\d{9}$/;
          if (!reg.test(this.userPhone)){
              alert('手机号码格式有误！');
              return;
          }
          $.ajax({
              url:'http://ahfensitong.com/huishang/fanpai/api.php?action=updateMobile',
              type:'GET',
              data:{mobile:this.userPhone,jsonp:1,openid:window.wx_id},
              dataType:'jsonp',
              success:(data)=>{
                  if (data.error!=0){
                      alert('网络错误');
                      return;
                  }
                  if (confirm('提交成功！是否转到排行榜？')){
                      this.$router.push({path:'/tp'});
                  }
              }
          })
      }
  },
  data () {
    return {
      imgs:['http://n.sinaimg.cn/ah/865fe30d/20171024/subBg.png'],
      isLoading:true,
      progress:0,
      userPhone:'12345678977',
      isForbiden:true
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
    width: 5.72rem;
    top:0.26rem;
    left: 0.3rem;
  }
  .prizeCont{
          width: 4.6rem;
            top: 4.4rem;
            left: 0.7rem;
            font-size: 0.4rem;
            text-align: center;
            font-weight: bold;
            color: #6b2500;
  }
  .userphone{
      width: 4.76rem;
      height: 0.56rem;
      top:6.19rem;
      left: 0.5rem;
      background: none;
      border:none;
      outline: none;
      font-size:0.28rem;
      text-align: center;
  }
  .btnList{
      width:4.66rem;
      top:7.22rem;
      left: 0.52rem;
  }
  .subBtn{
      width: 2.38rem;
      height: 0.87rem;
      margin:  0 auto;
  }
  .listBtn{
      width:100%;
      overflow: hidden;
      display:flex;
      justify-content: space-around;
      
  }
  .listBtn>div,.listBtn>a{
      width:1.87rem;
  }
  /* .hasSub{
      float: left;
  }
  .resStart{
      float: right;
  } */
</style>

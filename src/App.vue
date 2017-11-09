<template>
  <div id="app">
    <router-view @play-music="playAudio" />
  </div>
</template>

<script>
var myVue = {
  name: 'app',
  audioLoaded:0,
  bgAudio:null,
  m1:null,
  m2:null,
  m3:null,
  m4:null,
  wxFlag:false,
  created(){
    this.loadAudio();
    // this.playAudio('bgAudio');
    window.vueApp=this;
    console.log('AppReady');
  },
  mounted(){
    console.log('AppMounted');
  },
  data(){
    return {
      audioList:['http://n.sinaimg.cn/ah/865fe30d/20171026/bg.mp3','http://n.sinaimg.cn/ah/865fe30d/20171026/1.mp3','http://n.sinaimg.cn/ah/865fe30d/20171026/2.mp3','http://n.sinaimg.cn/ah/865fe30d/20171026/3.mp3','http://n.sinaimg.cn/ah/865fe30d/20171102/4.mp3'],
    }
  },
  watch:{
    wxFlag(){
      this.loadAudio();
      this.playAudio('bgAudio');
    }
  },
  methods:{
    playAudio(src){
      console.log(src);
      if (src!='bgAudio'){
        this.bgAudio.pause();
      }
      this[src].play();
    },
    loadAudio () {
      this.audioList.forEach((src)=>{
        var audio = new Audio();
        audio.src=src;
        audio.preload=true;
        if (src=="http://n.sinaimg.cn/ah/865fe30d/20171026/bg.mp3"){
          this.bgAudio=audio;
        }
        if (src=="http://n.sinaimg.cn/ah/865fe30d/20171026/1.mp3"){
          this.m1=audio;
        }
        if (src=="http://n.sinaimg.cn/ah/865fe30d/20171026/2.mp3"){
          this.m2=audio;
        }
        if (src=="http://n.sinaimg.cn/ah/865fe30d/20171026/3.mp3"){
          this.m3=audio;
        }
        if (src=="http://n.sinaimg.cn/ah/865fe30d/20171102/4.mp3"){
          this.m4=audio;
        }
      });
    }
  }
}
// window.vueApp = myVue;
export default myVue;
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
}
*{
  padding:0px;
  margin:0px;
}

ul,li {
  list-style-type: none;
  padding: 0;
}
img{
  vertical-align: middle;
}
.pos_abs{
  position: absolute;
  z-index: 1;
}
.pos_rel{
  position: relative;
}
.dis_flex{
  display: flex;
}
.mainCont{
  width: 100%;
  height: 100%;
}
.animate{
  z-index: 3;
}
.animate img{
    width: 100%;
    height: auto;
    display: block;   
}
.page{
    width:100%;
    margin:0 auto;
    height: 100%;
    background-size: 100% auto;
}
  .pageInner{
    width: 6.4rem;
    height: 11.36rem;
    margin:0 auto;
  }
  .loading{
    font-size: 0.3rem;
    width: 6.4rem;
    text-align: center;
    line-height: 0.35rem;
    top:50%;
    margin-top: -0.175rem;
    color: #000;
    font-weight: bold;
  }
  .before:before{
    content: '';
    display: table;
  }
</style>

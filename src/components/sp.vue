<template>
  <div class="page">
      <div class="hover" v-if = "isShowModal">
          <div class="failMsg pos_abs animate" v-if ="modalView=='fail'">
              <img src='http://n.sinaimg.cn/ah/865fe30d/20171023/fail.png'>
              <input v-model="inputUserPhone" v-if = "userPhone==''" class="getedPhone pos_abs" placeholder="留下手机号参与排名">
              <span class="pos_abs failBTn resBtn" @click="subInfo"></span>
          </div>
          <div class="succMsg pos_abs animate" v-if ="modalView=='succ'">
              <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/succ.png">
              <span class="pos_abs succBTn resBtn" @click="nextPoint"></span>
          </div>
      </div>
      <div class="pageInner pos_rel">
          <div class="loading pos_abs" v-if = "isLoading">
              加载中,请稍候....(已加载{{progress}}%)
          </div>
          <div class="mainCont pos_rel" v-show ="!isLoading">
              <div class="head pos_abs animate animate1">
                  <img :src="pointPic[currIndex]">
              </div>
              <div class="pos_abs activeMode animate" v-show="isActiveMode">
                <img :src="modelList[modeType]"> 
              </div> 
              <div class="picsList pos_abs animate animate2 before">
                <div class="listInner before pos_rel">
                    
                    <ul class="list before" ref="contains">
                     <li class="listItem animate act" v-for="(val,index) in currCp.pics" @click = "flip(val,index)" :ref="'item'+val.index+val.sortIdx">
                        <div class="outer pos_rel">
                          <div class="back animate pos_abs">
                            <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/gb.png">
                          </div>
                          <div class="front animate pos_abs">
                            <img :src="val.src">
                          </div>
                        </div>
                     </li>
                   </ul>
                   
                </div>
                <p class="tips" v-if = "isPreview">游戏{{StartLeaveTime}}秒后开始</p>
                <div v-if="!isPreview">
                  <div class="timeLine pos_rel">
                    <div class="timeInner"  ref="timers"></div>
                    <transition name="toup">
                      <span v-if="isAdd" class="pos_abs addTime">+2s</span>
                    </transition>
                  </div>
                  <p class="playLeave">倒计时:{{playLeave}}秒</p>
                </div>
                
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import mixin from '@/mixin/'
export default {
  name: 'sp',
  mixins:[mixin],
  created(){
      let openId = window.wx_id;
      $.ajax({
          url:'http://ahfensitong.com/huishang/fanpai/api.php?action=getMobile',
          type:'GET',
          data:{openid:openId,jsonp:1},
          dataType:'jsonp',
          success:(data)=>{
              console.log(data);
              if (data.error!=0){
                  alert('网络错误!');
                  return;
              }
              if (data.data=='NO'||data.data==''){
                  this.userPhone='';
              }else{
                  this.userPhone=data.data;
              }
          }
      })
  },
  mounted () {
    if (this.loadImgFlag==true){
      this.initGame();
    }
    this.mountedFlag=true;
    this.usedTime = 0;
  },
  watch:{
    stepSta (news,olds){
      var item1 = this.tmpCache[0];
      var dom1 = $(this.$refs['item'+item1.index+item1.sortIdx][0]);
      if (news == 2){
        var item2 = this.tmpCache[1];
        var dom2 = $(this.$refs['item'+item2.index+item2.sortIdx][0]);
      //   if (item1.index == item2.correctIndex){
      //    this.$emit('play-music','m2');
      //  }else{
      //    this.$emit('play-music','m3');
      //  }
      }
      dom1.addClass('hasFlip')
      dom1.addClass('hasFlip')
       
      setTimeout(()=>{
        if (news == 2){
          if (item1.index == item2.correctIndex){
            dom1.addClass('fliped')
            dom2.addClass('fliped')
            // this.$emit('play-music','m2');
            if (item1.index==3||item1.index==9){
                this.modeType=0;
                this.isActiveMode=true;
                this.isAdd=true;
                this.playLeave+=2;
                this.currCp.useTime+=2000;
              setTimeout(()=>{
                this.isActiveMode=false;
              },1800)
              setTimeout(()=>{
                 this.isAdd=false;
              },800)
            }
            if (item1.index==13||item1.index==0){
                this.modeType=1;
                this.isActiveMode=true;
              this.isAdd=true;
              this.playLeave+=2;
              this.currCp.useTime+=2000;
              setTimeout(()=>{
                this.isActiveMode=false;
              },1800)
              setTimeout(()=>{
                 this.isAdd=false;
              },800)
            }
            this.leaveCouple--;
          }else{
            // this.$emit('play-music','m3');
            $(this.$refs['item'+item1.index+item1.sortIdx][0]).removeClass('act').removeClass('hasFlip')
            $(this.$refs['item'+item2.index+item2.sortIdx][0]).removeClass('act').removeClass('hasFlip')
          }
          this.tmpCache.length=0;
        }
      },300)
      
    },
    leaveCouple(news,old){
      if (news == 0){
        this.gameSta=3;
      }
    },
    gameSta (news) {
      if (news==4){
        this.showModal('fail');
         clearInterval(this.timer);
         this.timer=null;
         this.usedTime += (Date.now()-this.lastTimeStamp);
      }
      if (news==3){
        if (this.currIndex==4){
          this.sendGrade(true);
          
          clearInterval(this.timer);
          this.timer=null;
          this.usedTime += (Date.now()-this.lastTimeStamp);
          return
        }
        this.showModal('succ');
        clearInterval(this.timer);
        this.timer=null;
        this.usedTime += (Date.now()-this.lastTimeStamp);
      }
    },
    playLeave (news,olds) {
      if (olds == -1){
        return
      }
      let allTime = this.currCp.useTime/1000;
      $(this.$refs['timers']).css({width:(news/allTime)*100+'%'})
    },
    currIndex (news) {
      this.initGame();
    }
  },
  methods :{
    subInfo () {
      this.sendGrade (false,()=>{
        if (this.inputUserPhone){
          this.subPhone();
        }else{
          this.$router.push({path:'/'});
        }
      });
      
    },
    subPhone(){
          let reg = /^1[356487]\d{9}$/;
          if (!reg.test(this.inputUserPhone)){
              alert('手机号码格式有误！');
              return false;
          }
          $.ajax({
              url:'http://ahfensitong.com/huishang/fanpai/api.php?action=updateMobile',
              type:'GET',
              data:{mobile:this.inputUserPhone,jsonp:1,openid:window.wx_id},
              dataType:'jsonp',
              success:(data)=>{
                  this.$router.push({path:'/'});
                  if (data.error!=0){
                      alert('网络错误');
                      return;
                  }
                  this.hideModal();
                  this.userPhone=this.inputUserPhone;
                  
              }
          })
      },
    sendGrade (isRe,call) {
      let data = {
        openid:window.wx_id,
        name:window.wx_name,
        avatar:window.wx_avatar,
        used:this.usedTime,
        level:this.currIndex+1,
        status:this.gameSta==3?1:0,
        jsonp:1
      }
      $.ajax({
        url:'http://ahfensitong.com/huishang/fanpai/api.php?action=addUser',
        type:'GET',
        data:data,
        dataType:'jsonp',
        success:(data)=>{
          if (data.error!=0){
            alert("网络错误！");
            return;
          }
          if (call){
            let ret = call();
            if (!ret){
              return;
            }
          }
          isRe&&this.$router.push({path:'/sub',query:{prize:data.data.prize,uid:data.data.id}})
        }
      })
    },
    nextPoint (){
      this.currIndex<4&&this.currIndex++;
      this.currCp.pics.forEach((val)=>{
             $(this.$refs['item'+val.index+val.sortIdx][0]).removeClass('fliped');
             $(this.$refs['item'+val.index+val.sortIdx][0]).removeClass('hasFlip');
      })
      this.hideModal();
    },
    hideModal(){
      this.isShowModal=false;
    },
    showModal (msg) {
      this.isShowModal=true;
      this.modalView=msg;
    },
    flip (val,index) {

      if (this.tmpCache.length>=2||this.gameSta<1){
        return;
      }
      if (this.gameSta==1){
        this.lastTimeStamp = Date.now();
        this.gameSta=2;
        let timer;
        !this.timer&&(this.timer = setInterval(()=>{
                  this.playLeave--;

                  // this.usedTime++;
                  if (this.playLeave<=0){
                    this.gameSta!=3&&(this.gameSta=4)
                    clearInterval(this.timer);
                    this.timer=null;
                  }
                },1000))
      }
      let item=$(this.$refs['item'+val.index+index][0])
      if (item.hasClass('hasFlip')){
        return;
      }
      this.tmpCache.push(val);
      this.stepSta=this.tmpCache.length;
      item.addClass('act');
      var item1 = this.tmpCache[0];
      var dom1 = $(this.$refs['item'+item1.index+item1.sortIdx][0]);
      if (this.stepSta == 2){
        var item2 = this.tmpCache[1];
        var dom2 = $(this.$refs['item'+item2.index+item2.sortIdx][0]);
        if (item1.index == item2.correctIndex){
         if ([3,9,13,0].indexOf(item1.index)>-1){
           this.$parent.playAudio('m4');
           return;
         }
         this.$parent.playAudio('m2');
       }else{
         this.$parent.playAudio('m3');
       }
      }
    },
    initGame () {
      let source = JSON.parse(JSON.stringify(this.Checkpoint[this.currIndex]));
      let target = this.currCp;
      Object.keys(target).forEach((item)=>{
          if (item == 'pics'){
            this.currCp['pics'].length=0;
            let count = source['rows']*source['cols']/2;
            let tmpArr = this.getPics(count);
            let tmpArr2 = JSON.parse(JSON.stringify(tmpArr));
            let index;
            this.leaveCouple = tmpArr2.length;
            while ((index = Math.ceil(Math.random()*(tmpArr2.length-1)))>=0&&count>0) {
              count-- ;
              
              let innerTmp = tmpArr2.splice(index,1)[0];
              if (innerTmp.index!=innerTmp.correctIndex){
                innerTmp.index=[innerTmp.correctIndex,innerTmp.correctIndex=innerTmp.index][0];
                innerTmp.src = this.matePic[innerTmp.index];
              }
              tmpArr.push(innerTmp);
            }
            tmpArr.forEach((item,index)=>{
              item.sortIdx = index;
              this.currCp.pics.push(item);
            })
          }else{
           target[item] = source[item];
          }
          
      })
      let timer;
      timer = setInterval(()=>{
        this.StartLeaveTime>0&&this.StartLeaveTime--;
        if (this.StartLeaveTime==0){
          this.gameSta=1;
          clearInterval(timer);
          timer=null;
          this.currCp.pics.forEach((val)=>{
            $(this.$refs['item'+val.index+val.sortIdx][0]).removeClass('act');
             $(this.$refs['item'+val.index+val.sortIdx][0]).removeClass('fliped');
          })
          this.isPreview=false;
        }
      },1000)
      $(this.$refs['contains']).css({'margin-top':(6.9-this.currCp.rows*1.1)/2+'rem',width:1.1*this.currCp.cols+'rem'})
      this.StartLeaveTime = this.currCp.obTime/1000;
      this.playLeave = this.currCp.useTime/1000;
      this.tmpCache.length=0;
      this.isPreview=true;
    },
    getPics (count) {

      let tmpArr = [];
      let sourceArr = JSON.parse(JSON.stringify(this.matePic));
      let index;
      while ((index = Math.ceil(Math.random()*(sourceArr.length-1)))>=0&&count>0){
        
        count--;
        let src = sourceArr.splice(index,1)[0];
        let trueIndex = this.matePic.indexOf(src);
        let correctIndex;
        correctIndex=trueIndex==3?9:
        trueIndex==9?3:
        trueIndex==0?13:
        trueIndex==13?0:
        trueIndex;
        tmpArr.push({index:this.matePic.indexOf(src),src:src,correctIndex:correctIndex});
      }
      return JSON.parse(JSON.stringify(tmpArr));
    }
  },
  data () {
    return {
      imgs:["http://n.sinaimg.cn/ah/865fe30d/20171023/g1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g5.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g6.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g7.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g8.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g9.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g10.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g11.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g12.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g13.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g14.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g15.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round5.png","http://n.sinaimg.cn/ah/865fe30d/20171023/2bg.png","http://n.sinaimg.cn/ah/865fe30d/20171023/2.jpg",'http://n.sinaimg.cn/ah/865fe30d/20171023/gb.png','http://n.sinaimg.cn/ah/865fe30d/20171023/fail.png','http://n.sinaimg.cn/ah/865fe30d/20171102/fail22222.png',"http://n.sinaimg.cn/ah/865fe30d/20180123/g16.png","http://n.sinaimg.cn/ah/865fe30d/20180123/g17.png"],
      matePic:["http://n.sinaimg.cn/ah/865fe30d/20171023/g1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g5.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g6.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g7.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g8.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g9.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g10.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g11.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g12.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g13.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g14.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g15.png","http://n.sinaimg.cn/ah/865fe30d/20180123/g16.png","http://n.sinaimg.cn/ah/865fe30d/20180123/g17.png"],
      pointPic:["http://n.sinaimg.cn/ah/865fe30d/20171023/round1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round5.png"],
      Checkpoint:[
        {
          obTime:2000,
          useTime:20000,
          rows:2,
          cols:4,
          pics:[]
        },
        {
          obTime:3000,
          useTime:20000,
          rows:3,
          cols:4,
          pics:[]
        },
        {
          obTime:5000,
          useTime:30000,
          rows:4,
          cols:4,
          pics:[]
        },
        {
          obTime:7000,
          useTime:60000,
          rows:5,
          cols:4,
          pics:[]
        },
        {
          obTime:9000,
          useTime:100000,
          rows:6,
          cols:5,
          pics:[]
        },
      ],
      currCp:{
          obTime:3000,
          useTime:5000,
          rows:2,
          cols:5,
          pics:[]
      },
      currIndex:0,
      gameSta:0,//0:游戏准备中,1:游戏已准备好,可以开始，2、游戏正在进行中，3、游戏结束(完成)，4、游戏结束(未完成)
      stepSta:0,//0:一个未点，1：点了一个，2：点了两个
      tmpCache:[],
      StartLeaveTime:3,
      playLeave:-1,
      isPreview:true,
      timer:null,
      isShowModal:false,
      modalView:'fail',
      leaveCouple:-1,
      usedTime:0,
      mountedFlag:false,
      isActiveMode:false,
      modelList:['http://n.sinaimg.cn/ah/865fe30d/20171102/2004822143451.gif','http://n.sinaimg.cn/ah/865fe30d/20171102/20048215630508ss.gif'],
      modeType:0,
      isAdd:false,
      inputUserPhone:'',
      userPhone:'',
      lastTimeStamp:0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page{
    background:url(http://n.sinaimg.cn/ah/865fe30d/20171023/2.jpg) no-repeat center top;
  }
  .animate1{
    top:0.42rem;
    left: 0.28rem;
    /*opacity: 0;*/
    /*-webkit-animation:zoomIn .5s ease-out .5s forwards;*/
  }
  .animate2{
    width: 6.08rem;
    height: 9.07rem;
    background:url(http://n.sinaimg.cn/ah/865fe30d/20171023/2bg.png) no-repeat center top;
    background-size: 100% auto;
    top:2.08rem;
    left: 0.08rem;
    z-index: 2;
  }
  .list{
    width: 100%;
    overflow: hidden;
    margin:0 auto;

  }
  .listItem{
    width: 1.04rem;
    height: 1.04rem;
    float: left;margin:0.03rem;
  }
  .outer{
    width: 100%;
    height: 100%;
    transition:all .5s;
    transform-style: preserve-3d;
  }
  .outer div{
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    backface-visibility:hidden;

  }
  div.back{
    z-index: 4;
    transform: rotateY(0deg);
  }
  div.front{
    z-index: 3;
    transform: rotateY(-180deg);
  }
  .listItem.act .outer{
    transform:rotateY(-180deg);
  }
  .listInner{
    width: 5.53rem;
    margin: 0.83rem 0 0 0.4rem;
    height: 6.9rem;
  }
  .tips{
    font-size: 0.4rem;
    text-align: center;
    font-weight: bold;
  }
  .timeLine{
    width: 4.06rem;
    height: 0.23rem;
    border:0.05rem solid #b04822;
    border-radius: 0.23rem;
    margin:0 auto;
  }
  .timeInner{
    width: 100%;
    height: 100%;
    border-radius: 0.23rem;
    background: #ffff06;
  }
  .playLeave{
    width: 100%;
    font-size: 0.27rem;
    color: #ff8d1e;
    font-weight: bold;
  }
  .hover{
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom:0;
    background:rgba(0,0,0,0.5);
    z-index: 999;
  }
  .failMsg{
    width: 6.03rem;
    top:50%;
    left: 50%;
    margin-top: -2.725rem;
    margin-left: -3.015rem;
  }
  .succMsg{
    width: 6.03rem;
    top:50%;
    left: 50%;
    margin-top: -2.725rem;
    margin-left: -3.015rem;
  }
  .resBtn{
    width: 2.49rem;
    height: 0.96rem;
    top:3.28rem;
    left: 1.95rem;
  }
  .fliped{
    visibility: hidden;
  }
  .activeMode{
    width: 3.6rem;
    height: 4.5rem;
    top: 26%;
    left: 59%;
    margin-top: -1.8rem;
    margin-left: -2.25rem;
    z-index: 100;
  }
  .addTime{
    font-size: 0.3rem;
    color: red;
    font-weight: bold;
    top: -0.05rem;
    right: -0.6rem;
  }
  .toup-enter-active, .toup-leave-active {
    transition: opacity .5s
  }
  .toup-enter, .toup-leave-to{
    opacity: 0;
  }
  .getedPhone{
    width: 3.28rem;
    top: 2.64rem;
    left: 1.5rem;
    height: 0.56rem;
    border: none;
    background: none;
    background: #e5e0e5;
    text-align: center;
    outline: none;
    border-radius: 0.16rem;
    line-height: 0.56rem;
    box-shadow: 0px 2px #fd9700;

  }
</style>

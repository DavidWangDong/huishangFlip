<template>
  <div class="page">
      <div class="hover" v-if = "isShowModal">
          <div class="failMsg pos_abs animate" v-if ="modalView=='fail'">
              <img src='http://n.sinaimg.cn/ah/865fe30d/20171023/fail.png?sdfdf'>
              <input v-model="inputUserPhone" v-if = "userPhone==''" class="getedPhone pos_abs" placeholder="留下手机号参与排名">
              <span class="pos_abs failBTn resBtn" @click="subInfo"></span>
          </div>


          <div class="succMsg pos_abs animate" v-if ="modalView=='succ'">
              <img src="http://n.sinaimg.cn/ah/865fe30d/20171023/succ.png">
              <span class="pos_abs succBTn resBtn" @click="nextPoint"></span>
          </div>
          
          <div class="alertMsg pos_abs animate" v-if ="modalView=='alert'">
              <img :src="detailSrc">
              <span class="pos_abs startBtn resBtn" @click="isShowDetail=false"></span>
          </div>

          <div class="frozen pos_abs animate" v-if ="modalView=='frozen'" @click.stop.prevent="blank">
              <img src="http://n.sinaimg.cn/ah/865fe30d/20180328/frozen.png">
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
                     <li v-for="(val,index) in currCp.pics" :class="['listItem','animate',{'act':val.act},{itemSpecial:Checkpoint[currIndex].cols>=5},{hasFlip:val.act},{fliped:val.isFlip}]"  @click = "flip(val,index)" :ref="'item'+val.index+val.sortIdx" :key="index">
                        <div class="outer pos_rel tmpouter">
                          <div class="back animate pos_abs">
                            <img :src="!val.hide?'http://n.sinaimg.cn/ah/865fe30d/20171023/gb.png':'http://n.sinaimg.cn/ah/865fe30d/20180525/YinCangPaiZi.png'">
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
                      <span v-if="isAdd" class="pos_abs addTime animate">
                         <img src="http://n.sinaimg.cn/ah/865fe30d/20180308/2Miao.png">
                      </span>
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
import {beforeList,afterList,beforeGetCorrectIndex} from '@/eventList'
export default {

  name: 'sp',
  mixins:[mixin],
  created(){
      // 默认第几关
      this.currIndex = 8 ;
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
              }else{
                  this.userPhone=data.data;
              }
          }
      })

    this.eventList.before_dispath = this.create_chains(this.eventList.beforeList)
    this.eventList.beforeGetCorrectIndex_dispath = this.create_chains(this.eventList.beforeGetCorrectIndex)
    this.eventList.after_dispath = this.create_chains(this.eventList.afterValidateList)

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
        item2&&(item2.act=true);
        this.eventList.after_dispath(news,item1,item2);
        
      }

      item1.act=true;
      
    },
    leaveCouple(news,old){
      if (news == 0){
        this.gameSta=3;
      }
    },
    gameSta (news) {
      if (news==4){
        this.showModal('fail');
        this.sendGrade(false);
         clearInterval(this.timer);
         this.timer=null;
      }
      if (news==3){
        if (this.currIndex==(this.Checkpoint.length-1)){
          this.usedTime += (Date.now()-this.lastTimeStamp);
          this.sendGrade(true);
          clearInterval(this.timer);
          this.timer=null;
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
    blank (){

    },
    subInfo () {
      this.sendGrade (false,()=>{
        if (!this.userPhone){
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
          isRe&&this.$router.push({path:'/sub',query:{prize:data.data.prize,uid:data.data.id,time:this.usedTime}})
        }
      })
    },
    nextPoint (){
      $(this.$refs['contains']).find('li').each(function(index,val){
        $(val).find('.tmpouter').removeClass('outer');
      });
      setTimeout(() => {
           $(this.$refs['contains']).find('li').each(function(index,val){
              $(val).removeClass('act');
            });
           setTimeout(() => {
                $(this.$refs['contains']).find('li').each(function(index,val){
                    $(val).find('.tmpouter').addClass('outer');
                  });
            });
          (this.currIndex<this.Checkpoint.length-1)&&this.currIndex++;
           this.currCp.pics.forEach((val)=>{
                val.isFlip=false
                val.act=false
          })
          this.hideModal();
      });
      
    },
    hideModal(){
      this.isShowModal=false;
    },
    showModal (msg) {
      this.isShowModal=true;
      this.modalView=msg;
    },
    flip (val,index) {
      if (this.gameSta==0){
        return;
      }
      if (this.tmpCache.length>=2||this.gameSta<1){
        return;
      }
      
     
      if (val.act){
        return;
      }
      
      this.tmpCache.push(val);
      this.stepSta=this.tmpCache.length;
      val.act = true
      var item1 = this.tmpCache[0];
      if (this.stepSta == 2){
        var item2 = this.tmpCache[1];
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
            
            tmpArr2.some((val,index)=>{
              if (val.hide==true) {
                tmpArr2[index].hide=false;
                if (tmpArr2[index-1]) {
                  tmpArr2[index-1].hide=true;
                }else{
                   tmpArr2[tmpArr2.length-1].hide=true;
                } 
                return true;
              }
            })

            let index;
            this.leaveCouple = tmpArr2.length;
            while ((index = Math.floor(Math.random()*(tmpArr2.length)))>=0&&count>0) {
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
      
      this.eventList.before_dispath();
      
      
    },
    getPics (count) {

      let tmpArr = [];
      let sourceArr = JSON.parse(JSON.stringify(this.matePic));
      let index;
      while ((index = Math.floor(Math.random()*(sourceArr.length)))>=0&&count>0){
        
        count--;
        let src = sourceArr.splice(index,1)[0];
        let trueIndex = this.matePic.indexOf(src);
        const correctIndex = {correctIndex:''};
        // 抽取对应卡片
        let hash = {
            3:9,
            9:3,
            0:13,
            13:0
        }
        if (trueIndex in hash) {
            correctIndex.correctIndex = hash[trueIndex]
        }else{
            correctIndex.correctIndex = trueIndex;
        }
        tmpArr.push({index:this.matePic.indexOf(src),src:src,correctIndex:correctIndex.correctIndex,act:false,isFlip:false,hide:false});
        
      }
      this.eventList.beforeGetCorrectIndex_dispath(tmpArr);
      return JSON.parse(JSON.stringify(tmpArr));
    },

    // 工具

    create_chains (arr) {
          
          let tmpFuncArr = [];
          for (let i=0,len = arr.length-1;i<=len;i++){
              if (i==0){
                tmpFuncArr.unshift(arr[len].bind(this,function(){}))
              }else{
                let func = arr[len-i].bind(this,tmpFuncArr[0])
                tmpFuncArr.unshift(func)
              }
          }
          return tmpFuncArr[0];
    }
  },
  data () {
    return {
      imgs:['http://n.sinaimg.cn/ah/865fe30d/20180328/frozen.png',"http://n.sinaimg.cn/ah/865fe30d/20180330/round6.png","http://n.sinaimg.cn/ah/865fe30d/20180330/round7.png","http://n.sinaimg.cn/ah/865fe30d/20180330/round8.png","http://n.sinaimg.cn/ah/865fe30d/20180328/alertDetail.png","http://n.sinaimg.cn/ah/865fe30d/20180308/2Miao.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g5.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g6.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g7.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g8.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g9.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g10.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g11.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g12.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g13.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g14.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g15.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round5.png","http://n.sinaimg.cn/ah/865fe30d/20171023/2bg.png","http://n.sinaimg.cn/ah/865fe30d/20171023/2.jpg",'http://n.sinaimg.cn/ah/865fe30d/20171023/gb.png','http://n.sinaimg.cn/ah/865fe30d/20171023/fail.png?sdfdf','http://n.sinaimg.cn/ah/865fe30d/20171102/fail22222.png',"http://n.sinaimg.cn/ah/865fe30d/20180123/g16.png","http://n.sinaimg.cn/ah/865fe30d/20180123/g17.png","http://n.sinaimg.cn/ah/865fe30d/20180328/g18.png",'http://n.sinaimg.cn/ah/865fe30d/20180525/XinZengDanChuang.png','http://n.sinaimg.cn/ah/865fe30d/20180525/YinCangPaiZi.png'],
      matePic:["http://n.sinaimg.cn/ah/865fe30d/20171023/g1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g5.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g6.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g7.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g8.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g9.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g10.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g11.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g12.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g13.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g14.png","http://n.sinaimg.cn/ah/865fe30d/20171023/g15.png","http://n.sinaimg.cn/ah/865fe30d/20180123/g16.png","http://n.sinaimg.cn/ah/865fe30d/20180123/g17.png"],
      pointPic:["http://n.sinaimg.cn/ah/865fe30d/20171023/round1.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round2.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round3.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round4.png","http://n.sinaimg.cn/ah/865fe30d/20171023/round5.png","http://n.sinaimg.cn/ah/865fe30d/20180330/round6.png","http://n.sinaimg.cn/ah/865fe30d/20180330/round7.png","http://n.sinaimg.cn/ah/865fe30d/20180330/round8.png",'http://n.sinaimg.cn/ah/865fe30d/20180525/round9.png','http://n.sinaimg.cn/ah/865fe30d/20180525/round10.png','http://n.sinaimg.cn/ah/865fe30d/20180525/round11.png'],
      Checkpoint:[
        {
          obTime:1000,
          useTime:20000,
          rows:2,
          cols:4,
          pics:[],
          showAlert:false,
          detailSrc:'http://n.sinaimg.cn/ah/865fe30d/20180328/alertDetail.png'
        },
        {
          obTime:2000,
          useTime:20000,
          rows:3,
          cols:4,
          pics:[],
          showAlert:false,
          detailSrc:''
        },
        {
          obTime:2000,
          useTime:30000,
          rows:4,
          cols:4,
          pics:[],
          showAlert:false,
          detailSrc:''
        },
        {
          obTime:3000,
          useTime:60000,
          rows:5,
          cols:4,
          pics:[],
          showAlert:false,
          detailSrc:''
        },
        {
          obTime:3000,
          useTime:90000,
          rows:6,
          cols:5,
          pics:[],
          showAlert:false,
          detailSrc:''
        },{
          obTime:2000,
          useTime:20000,
          rows:3,
          cols:4,
          pics:[],
          showAlert:true,
          detailSrc:'http://n.sinaimg.cn/ah/865fe30d/20180328/alertDetail.png'
        },{
          obTime:2000,
          useTime:40000,
          rows:5,
          cols:4,
          pics:[],
          showAlert:false,
          detailSrc:''
        },{
          obTime:3000,
          useTime:80000,
          rows:6,
          cols:5,
          pics:[],
          showAlert:false,
          detailSrc:''
        },{
          obTime:2000,
          useTime:20000,
          rows:3,
          cols:4,
          pics:[],
          showAlert:true,
          detailSrc:'http://n.sinaimg.cn/ah/865fe30d/20180525/XinZengDanChuang.png'
        },{
          obTime:3000,
          useTime:40000,
          rows:5,
          cols:4,
          pics:[],
          showAlert:false,
          detailSrc:''
        },{
          obTime:3000,
          useTime:80000,
          rows:6,
          cols:5,
          pics:[],
          showAlert:false,
          detailSrc:''
        }

      ],
      currCp:{
          obTime:3000,
          useTime:5000,
          rows:2,
          cols:5,
          pics:[],
          showAlert:false,
          detailSrc:'http://n.sinaimg.cn/ah/865fe30d/20180328/alertDetail.png'
      },
      currIndex:-1,
      gameSta:0,//0:游戏准备中,1:游戏已准备好,可以开始，2、游戏正在进行中，3、游戏结束(完成)，4、游戏结束(未完成)
      stepSta:0,//0:一个未点，1：点了一个，2：点了两个
      tmpCache:[],
      StartLeaveTime:3,
      playLeave:-1,
      isPreview:true,
      timer:null,
      isShowModal:false,
      modalView:'frozen',
      leaveCouple:-1,
      usedTime:0,
      mountedFlag:false,
      isActiveMode:false,
      modelList:['http://n.sinaimg.cn/ah/865fe30d/20171102/2004822143451.gif','http://n.sinaimg.cn/ah/865fe30d/20171102/20048215630508ss.gif'],
      modeType:0,
      isAdd:false,
      inputUserPhone:'',
      userPhone:'',
      lastTimeStamp:0,
      // 当前通知图片地址
      detailSrc:'http://n.sinaimg.cn/ah/865fe30d/20180328/alertDetail.png',

      // 是否显示通知

      isShowDetail:'',
      // 处理队列
      eventList:{
        beforeList:beforeList,
        afterValidateList:afterList,
        beforeGetCorrectIndex:beforeGetCorrectIndex,
        before_dispath:null,
        after_dispath:null,
        beforeGetCorrectIndex_dispath:null
      },
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
    width: 1.2rem;
    height: 1.2rem;
    float: left;margin:0.03rem;
  }

  .listItem.itemSpecial{
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
    height: .96rem;
    top: 3.44rem;
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
    top: -0.76rem;
    right: -0.38rem;
    width:2.15rem;
  }
  .toup-enter-active, .toup-leave-active {
    transition: opacity .5s
  }
  .toup-enter, .toup-leave-to{
    opacity: 0;
  }
  .getedPhone{
       width: 4.6rem;
    top: 2.46rem;
    left: 0.76rem;
    height: .78rem;
    border: none;
    background: none;
    background: #e5e0e5;
    text-align: center;
    outline: none;
    border-radius: .16rem;
    line-height: .56rem;
    box-shadow: 0 2px #fd9700;
    font-size:0.3rem;

  }
  .alertMsg{
    width:5.67rem;
    /* height:6.3rem; */
    top:50%;
    margin-top:-3.15rem;
    left:50%;
    margin-left:-2.835rem;
  }
  .startBtn{
    bottom:0.4rem;
    left:1.52rem;
    top:auto;
  }
  .frozen{
    width:100%;
    top:0;
    left:0;
  }
</style>

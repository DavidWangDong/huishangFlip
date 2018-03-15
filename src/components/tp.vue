<template>
  <div class="page">
      <div class="pageInner pos_rel">
          <div class="loading pos_abs" v-if = "isLoading">
              加载中,请稍候....(已加载{{progress}}%)
          </div>
          <div class="mainCont pos_rel" v-if ="!isLoading">
               <div class="pos_abs animate1 animate">
                 <img src="http://n.sinaimg.cn/ah/865fe30d/20171102/tpBg.png">
                 <div class="lister pos_abs">
                    <div class="listerItem pos_rel before" v-for="(val,index) in dataList" :key="index">
                        <div :class="[{'prizeIcon':index<=2&&currPage<=1},{'prizeCount':(currPage<=1&&index>2)||(currPage>1)},'animate']">
                            <img :src="prizePic[index]" alt="" v-if = "index<=2&&currPage<=1">
                            {{(currPage<=1&&index>2)?index+1:''}}{{(currPage>1)?((currPage-1)*10+index+1):''}}
                        </div>
                        <div class="prizeImg animate">
                            <img :src="val.avatar" alt="">
                        </div>
                        <div class="prizeName">
                            {{val.name}}
                        </div>
                        <div class="prizeLeval">{{val.level|filName}}</div>
                        <div class="prizeSecond">{{Math.floor(val.used/1000)}}'{{val.used%1000}}"</div>
                    </div>
                 </div>
                 <div class="navPanel pos_abs">
                     <span v-for="(page,index) in pageList" :class="['pageCount',{'actives':currPage==page}]" @click="chgPage(page)" :ref="'btn'+page">{{page}}</span>
                     <span class="pageLast pageCount" v-if="getList" @click="toLast()">末页</span>
                 </div>
               </div>
          </div>
      </div>
  </div>
</template>

<script>
import mixin from '@/mixin/'
export default {
  name: 'tp',
  mixins:[mixin],
  created(){
     this.getDataList();
      
  },
  computed:{
      getList () {
          return this.pageList.indexOf(this.maxPage)<=-1;
      }
  },
  filters:{
      filName(number){
          let list = ['第一关','第二关','第三关','第四关','第五关']
          return list[number-1];
      }
  },
  methods:{
      toLast(){
          this.currPage=this.maxPage;
      },
      reSetNav (news) {
          if (news==1){
              this.pageList.length=0;
              if (this.maxPage>=5){
                 [1,2,3,4,5].forEach((val)=>{
                     this.pageList.push(val);
                 })
              }else{
                  for (let i=1;i<=this.maxPage;i++){
                      this.pageList.push(i);
                  }
              }
              return;
          }
          if (news == this.maxPage){
              this.pageList.length=0;
              if (this.maxPage>=5){
                 [this.maxPage-4,this.maxPage-3,this.maxPage-2,this.maxPage-1,this.maxPage].forEach((val)=>{
                     this.pageList.push(val);
                 })
              }else{
                  for (let i=1;i<=this.maxPage;i++){
                      this.pageList.push(i);
                  }
              }
              return;
          }
          let index = this.pageList.indexOf(news);
          if (index>-1&&index==4){
              if (news<this.maxPage){
                  this.pageList.splice(0,1);
                  this.pageList.push(news+1);
              }
          }else if(index>-1&&index==0){
              if (news>1&&this.pageList.length>=5){
                  this.pageList.pop();
                  this.pageList.unshift(news-1);
              }
          }
      },
      chgPage (page) {
          let item = $(this.$refs['btn'+page][0])
          if (item.hasClass('actives')){
              return;
          }
          this.currPage = page;
          this.getDataList();
      },
      getDataList (){
          $.ajax({
          url:'http://ahfensitong.com/huishang/fanpai/api.php?action=getUsers',
          type:'GET',
          data:{page:this.currPage,jsonp:1},
          dataType:'jsonp',
          success:(data)=>{
              if (data.error!=0){
                  alert('网络错误!');
                  return;
              }
              this.maxPage=data.maxPage;
              if (data.data.length>0){
                  this.dataList.length=0;
                  data.data.forEach((val)=>{
                      this.dataList.push(val);
                  })
              }
              this.reSetNav(this.currPage);
          }
      })
      }
  },
  watch:{
      currPage (news){
          this.reSetNav(news)
      }
  },
  data () {
    return {
      imgs:['http://n.sinaimg.cn/ah/865fe30d/20171102/tpBg.png','http://n.sinaimg.cn/ah/865fe30d/20171024/prize1.png','http://n.sinaimg.cn/ah/865fe30d/20171024/prize2.png','http://n.sinaimg.cn/ah/865fe30d/20171109/prize3.png','http://n.sinaimg.cn/ah/865fe30d/20171024/XuHao.png'],
      isLoading:true,
      progress:0,
      pageList:[1,2,3,4,5],
      dataList:[
          {
              name:'测试1',
              avatar:'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoicwtj6x3l7NOcqXNSNyZBacbJAkEI4cXHCfV7trz2kdLrwZIwia5rzc2NgU8avbbHTuYaUlel11Ew/132',
              used:20
          }
      ],
      currPage:1,
      maxPage:20,
      prizePic:['http://n.sinaimg.cn/ah/865fe30d/20171024/prize1.png','http://n.sinaimg.cn/ah/865fe30d/20171024/prize2.png','http://n.sinaimg.cn/ah/865fe30d/20171109/prize3.png'],
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
    left:0.1rem;
  }
  .lister{
          width: 4.27rem;
        height: 7.64rem;
        top: 2.85rem;
        left: 1.07rem;
  }
  .listerItem{
      width:4.07rem;
      height: 0.33rem;
      background: #fff;
      margin-bottom: 0.45rem;
  }
  .listerItem>div{
      float: left;
  }
  .prizeIcon{
    width: 0.41rem;
    height: 0.6rem;
    margin-top: -0.1rem;
    margin-left: -0.04rem;
  }
  .prizeImg{
      width:0.71rem;
      height: 0.71rem;
      border-radius: 100%;
      background: #6b2500;
      overflow: hidden;
      margin-left: 0.15rem;
      margin-top: -0.2rem;
  }
  .prizeName,.prizeLeval{
      width:1.1rem;
      line-height: 0.33rem;
      font-size: 0.2rem;
      font-weight: bold;
      color: #6b2500;
      text-align: center;
  }
  .prizeLeval{
      width: auto;
  }
  .prizeSecond{
      width: 0.75rem;
      line-height: 0.33rem;
      text-align: center;
      font-size: 0.2rem;
      font-weight: bold;
      color: #6b2500;
      text-align: center;
  }
  .prizeCount{
          width: 0.41rem;
            height: 0.6rem;
            background: url(http://n.sinaimg.cn/ah/865fe30d/20171024/XuHao.png) no-repeat left top;
            background-size: 0.41rem auto;
            margin-top: -0.02rem;
            margin-left: -0.03rem;
            font-size: 0.19rem;
            color: #6b2500;
            font-weight: bold;
            line-height: 0.4rem;
  }
  .navPanel{
        width: 4.4rem;
        height: 0.3rem;
        top: 10.63rem;
        left: 1.16rem;
  }
  .pageCount{
      width: 0.34rem;
      height: 0.34rem;
      float: left;
      font-size: 0.27rem;
      text-align: center;
      line-height: 0.34rem;
      color:#fff;
      font-weight: bold;
      margin-right: 0.3rem;
      border-radius: 2px;
  }
  .pageCount.actives{
      box-shadow: 2px 2px 2px #ff4e04;
      background: #ffa71b;
  }
  .pageLast{
      width:0.52rem;
      font-size: 0.2rem;
      box-shadow: 2px 2px 2px #ff4e04;
      background: #ffa71b;
  }
</style>

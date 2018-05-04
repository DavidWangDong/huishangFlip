function timeout(time) {
   return  new Promise (function(resolve,reject){
        setTimeout(() => {
            resolve();
        }, time);
    })
}




// 关卡开始之前的队列
const beforeList = []

// 设置DOM
beforeList.push(function(next,arg){
    
    $(this.$refs["contains"]).css({
      "margin-top": (6.9 - this.currCp.rows * 1.3) / 2 + "rem",
      width: 1.26 * this.currCp.cols + "rem"
    });
    
    this.Checkpoint[this.currIndex].cols >= 5 && $(this.$refs["contains"]).css({

        "margin-top": (6.9 - this.currCp.rows * 1.1) / 2 + "rem",
        width: 1.1 * this.currCp.cols + "rem"
      });
    this.StartLeaveTime = this.currCp.obTime / 1000;
    this.playLeave = this.currCp.useTime / 1000;
    this.tmpCache.length = 0;
    this.isPreview = true;
    
    next();
})


// 显示通知栏
beforeList.push(function(next,arg){
    if (this.Checkpoint[this.currIndex].showAlert){
        this.isPreview = false;
        this.currCp.pics.forEach(val => {
          val.act = false;
        });
        this.detailSrc = this.Checkpoint[this.currIndex].detailSrc;
        this.modalView = "alert"
        this.isShowDetail = true;
        let timer = setInterval(()=>{
            if (this.isShowDetail===false){
                clearInterval(timer);
                timer = null;
                this.hideModal();
                this.isPreview = true;
                this.currCp.pics.forEach(val => {
                  val.act = true;
                });
                next();
            }
        },10)
        this.isShowModal = true;
        
    }else{
        next();
    }
})

beforeList.push(function(next,arg){
    // 第六到第八关  增加冰块图标
    if (this.currIndex>=5&&this.currIndex<=7){
        // this.matePic.push("http://n.sinaimg.cn/ah/865fe30d/20180328/g18.png");
    }
    next();
})



// 预览倒计时
beforeList.push(function(next, arg) {
  let timer;
  timer = setInterval(() => {
    this.StartLeaveTime > 0 && this.StartLeaveTime--;
    if (this.StartLeaveTime == 0) {
      this.gameSta = 1;
       if (this.gameSta == 1) {
         this.lastTimeStamp = Date.now();
         this.gameSta = 2;
         !this.timer && (this.timer = setInterval(() => {
             this.playLeave--;
             if (this.playLeave <= 0) {
               this.gameSta != 3 && (this.gameSta = 4);
               clearInterval(this.timer);
               this.timer = null;
             }
           }, 1000));
       }
      clearInterval(timer);
      timer = null;
      this.currCp.pics.forEach(val => {
        val.act = false;
      });
      this.isPreview = false;
    }
  }, 1000);
  next();
});

// 验证队列
const afterList = []


// 延迟两秒
afterList.push(function(next,news,item1,item2){
    if (news!=2){
        return;
    }
    this.tmpCache.length = 0;
    
    timeout(300).then(()=>{next(item1,item2)})
})

// 判断是否对应
afterList.push(function(next,item1,item2){
    if (item1.index == item2.correctIndex) {
      item1.isFlip = true;
      item2.isFlip = true;
      this.leaveCouple--;
      next(true,item1, item2);
    } else {
        item1.isFlip = false;
        item2.isFlip = false
        item1.act = false
        item2.act = false
        next(false, item1, item2);
    }
})
// 情况1
afterList.push(function(next,flag, item1, item2) {
  if ((item1.index == 3 || item1.index == 9) && flag) {
    this.modeType = 0;
    this.isActiveMode = true;
    this.isAdd = true;
    this.playLeave += 2;
    this.currCp.useTime += 2000;
    timeout(1800).then(() => {
      this.isActiveMode = false;
    });
    timeout(800).then(() => {
      this.isAdd = false;
    });
  }
  next(flag,item1, item2);
});


// 情况2
afterList.push(function(next, flag, item1, item2) {
  if ((item1.index == 13 || item1.index == 0) && flag) {
    this.modeType = 1;
    this.isActiveMode = true;
    this.isAdd = true;
    this.playLeave += 2;
    this.currCp.useTime += 2000;
    timeout(1800).then(() => {
      this.isActiveMode = false;
    });
    timeout(800).then(() => {
      this.isAdd = false;
    });
  }
  next(flag,item1, item2);
});

// 情况3
afterList.push(function(next,flag,item1,item2){
    
    if ((item1.index==17||item2.index==17)&&!flag){
        
        this.showModal('frozen');
        timeout(2000).then(()=>{
            this.playLeave>0&&this.hideModal();
        })
    }
    next(flag,item1,item2);
})



// 获取对应卡片序列
const beforeGetCorrectIndex = []
beforeGetCorrectIndex.push(function(next,tmpArr){
    // 第六到八关
    let level5 = {
        5:2,
        6:4,
        7:4
    }
    let src = 'http://n.sinaimg.cn/ah/865fe30d/20180328/g18.png'
    
    let tmp = {
      index: this.matePic.length,
      src: src,
      correctIndex: this.matePic.length,
      act: true,
      isFlip: false
    }


    if (this.currIndex>=5&&this.currIndex<=7){
        const  copyTmpArr = JSON.parse(JSON.stringify(tmpArr));
        const transList = []
        



        for (let i=0,len=level5[this.currIndex]/2;i<len;i++){
            let index = Math.ceil(Math.random() * (copyTmpArr.length - 1))
            let upSel = copyTmpArr.splice(index, 1)[0];
            transList.push(JSON.parse(JSON.stringify(tmp)))
            if (transList.length == level5[this.currIndex]) {
              break;
            }
        }

        
        
        const list = [...copyTmpArr];
        const  last = []
        let  real = []


        while(1){
            if (Math.random()<0.3){
                transList.length>0&&last.push(transList.pop())

            }else{
                list.length>0&&last.push(list.pop())
            }
            if (transList.length <= 0 || list.length <= 0) {
                real = [...last,...list,...transList]
                break;
            }
        }
        tmpArr.length=0;
        real.forEach((val)=>{
            tmpArr.push(val);
        })

    }
    next();
})

export {beforeList};
export {afterList};
export {beforeGetCorrectIndex};
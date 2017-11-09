export default {
	data(){
		return {
			isLoading:true,
			progress:0,
			loadImgFlag:false
		}
	},
	beforeMount () {
		if (!!!this.imgs||this.imgs.length<=0){
			this.isLoading=false;
			return;
		}
		var length = this.imgs.length;
		var count = 0;
		this.imgs.forEach((src)=>{
			let img = new Image();
			img.src = src;
			let that =this;
			img.onload = function(){
				that.progress = parseInt((++count/length)*100);
				// count==length&&(that.isLoading = false);
				if (count==length){
					that.isLoading = false;
					that.loadImgFlag = true;
					if (that.mountedFlag == true) {
						that.initGame&&that.initGame();
					}
				}
			}
		})
	}
}
function startDownload(url) {
  let imageURL = url;
  downloadedImg = new Image;
  downloadedImg.src = imageURL;
  return downloadedImg;
}

var drawArray = function(arr, width, height,c,ctx) {
	c.width = width;
	c.height = height;
	var dataImage = ctx.createImageData(width, height);
	if (dataImage.data.set) {
	  dataImage.data.set(arr);
	} else {
	  arr.forEach(function(val, i) {
		dataImage.data[i] = val;
	  });
	}
	ctx.putImageData(dataImage, 0, 0);
};

function erase(url,rm,feather){
	var canvas = document.createElement("canvas");
	var image = startDownload(url);
	var result = document.createElement("canvas");
	var resultStr;
	var p = new Promise((resolve,reject)=>{
		image.addEventListener("load", function(){
			// var rm=[255,255,255];
			canvas.width=image.width;
			canvas.height=image.height;
			var context = canvas.getContext("2d");
			context.drawImage(image,0,0);
			var data=context.getImageData(0, 0, image.width,image.	height).data;
			var normalArray = Array.from(data);
			var i,j,temparray,chunk = 4,newArray=[];
			for (i=0,j=normalArray.length; i<j; i+=chunk) {
				temparray = normalArray.slice(i,i+chunk);
				if(temparray[0]==rm[0] && temparray[1]==rm[1] && temparray[2]==rm[2]){
					temparray[3]=0;
				}else{
					if((temparray[0]-feather < rm[0] && temparray[0]+feather > rm[0]) && (temparray[1]-feather < rm[1] && temparray[1]+feather > rm[1]) && (temparray[2]-feather < rm[2] && temparray[2]+feather > rm[2])){
						temparray[3]=0;
					}
				}
				newArray.push(temparray[0]);
				newArray.push(temparray[1]);
				newArray.push(temparray[2]);
				newArray.push(temparray[3]);
			}
			result.width=image.width;
			result.height=image.height;
			var rctx = result.getContext("2d");
			drawArray(newArray,image.width,image.height,result,rctx);
			resultStr=result.toDataURL();
			resolve(resultStr);
		});
	});
	return p;
}
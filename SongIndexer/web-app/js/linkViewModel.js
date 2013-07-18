var xhrTimeout, apChangeCount=0;

function LinkVM(){
	
	var self = this;
	self.protocol = ko.observable("http://");
	self.subDomain = ko.observable("dtp6gm33au72i.");
	self.domain = ko.observable("cloudfront.net/");
	self.var1 = ko.observable("tf/");
	self.var2 = ko.observable("038/");
	self.var3 = ko.observable("453/");
	self.var4 = ko.observable("300/");
	self.var5 = ko.observable("hdceeU");
	self.songType = ko.observable(".48k.v3.m4a");
	self.maxApChangeCount = ko.observable(20);
	
	self.generatedLink = ko.computed(function(){
		return (self.protocol() + self.subDomain() + self.domain() + self.var1() + self.var2() + self.var3() + self.var4() + self.var5() + self.songType())
	});
	
	self.generateLink = function(){
		//var1 is found to be constant
		if (apChangeCount < self.maxApChangeCount()){
			apChangeCount++;
			self.var5(nextAlphaNumeric(self.var5()));//random alphanumeric
		}else{
			apChangeCount = 0;
			var temp = self.var2();
			var nextVar = nextNumber(self.var2());
			if (temp == nextVar){
				temp = self.var3();
				nextVar = nextNumber(self.var3());
				if (temp == nextVar){
					temp = self.var4();
					nextVar = nextNumber(self.var4());
					if (temp == nextVar){
						//end case!
					}else{
						self.var4(nextVar);
					}
				}else{
					self.var3(nextVar);
				}	
			}else{
				self.var2(nextVar);
			}
			
//			self.var2(nextNumber(self.var2()));
//			self.var3(nextNumber(self.var3()));
//			self.var4(nextNumber(self.var4()));
		}
		
	}
	
	self.stopXhrLog = function(){
		if (xhrTimeout){
			clearInterval(xhrTimeout);
		}
	}
	
	self.triedLinks = ko.observableArray();
	
	self.check = function(){
		checkSong(self, false);
	}
	
	self.generate = function(){
		checkSong(self, true);
	}
}


function nextNumber(curValue, random){
	if (!curValue)
		curValue = "000/";
	curValue = curValue.replace("/","");
	
	try {
		curValue = parseInt(curValue);
	}catch (err){
		curValue = 0;
	}
	
	if (curValue < 999){
		if (!random)
			curValue++;
		//else
			//add generate random logic
	}else{
		curValue = 0;
	}
	
	for (var i=0;i<=(3-(curValue.toString().length));i++){
		curValue = "0" + curValue.toString();
	}
	
	return curValue + "/";
}

function nextAlphaNumeric(curValue, random){
	return curValue;
}

function checkSong(self, tryNext){
	var xhr = $.ajax({
		url: self.generatedLink(),
		type: "get",
		success: function(data){
			console.log("Request was success!");
			console.log(data);
			//woohooo!
			foundSong(self, true, tryNext);
			
		},
		error: function(e){
			console.log(e);
			xhr = null;
			if (e.readyState == 0){ //it was aborted, ie req was success!
				foundSong(self, true, tryNext);
			}else{
				foundSong(self, false, tryNext);
			}
		}
	});
	
	setTimeout(function(){
		//if after 2 seconds, xhr is not null, it means song is streaming. it is success!
		if (xhr){
			xhr.abort();
		}
	}, 2000);
}

function foundSong(self, found, tryNext){
	self.triedLinks.push({
		linkURL: self.generatedLink(),
		success: found
	});
	
	if (tryNext){
		self.generateLink();
		checkSong(self, tryNext);
	}
}

//these are test player functions
function playSuccess(){
	console.log("Play was success!");
}

function loadSuccess(){
	console.log("music was loaded!");
}

function songError(){
	console.log("song in error:");
	console.log();
}
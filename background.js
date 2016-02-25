chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 	
/*
	if(sender.tab == null || sender.tab.url.match("chrome:// URL")){
		return ;
	}
	*/

	sender.tab = operation().getCurrentTab(function(tab){
		if(tab == null || tab.url.match("chrome://")){
			return ;
		}

		console.log(tab);

		if(sender.tab == null) sender.tab = tab;


		if(request.DataInfo.state == "initAll"){
			Run(sender.tab.id,null,sender.tab.url);
			operation().replaceColor();
			operation().UseUserFont(operation().getUserFont());
			operation().UseUserCss(operation().getUserCss());
		}

		if(request.DataInfo.state == "switchTheme"){
	 		Run(sender.tab.id,null,sender.tab.url);
	 	}


	 	if(request.DataInfo.state == "switchfontColor"){
	 		operation().replaceColor(request);
	 	}

	 	if(request.DataInfo.state == "reload"){
	 		chrome.tabs.executeScript({code: 'parent.window.location.reload();'});
	 	}
	});



 	


});

/*
chrome.tabs.onUpdated.addListener(function(tabId , info,tab) {

        var url = tab.url;
        Run(tabId,info,url);
        
});*/


function operation(){
	self = this;

	self.replaceColor = function(request){
		var colorvalues;
		if(request == null){
			colorvalues = localStorage['ColorValue'];
		}else {
			colorvalues = request.DataInfo.color;
			localStorage['ColorValue'] = colorvalues;
		}

		if(colorvalues == null){
			return;
		}
		
 		
 		chrome.tabs.insertCSS({code:'*{font-family:not specified !important;color:#' + colorvalues + ' !important;}'});
	}

	self.UseUserCss = function(css){
		if(css == null){
			return ;
		}else{
			chrome.tabs.insertCSS({code:css});
		}
	}

	self.UseUserFont = function(font){
		if(font == null){
			return ;
		}else{
			chrome.tabs.insertCSS({code:'*{font-family:' + font + ' !important;}'});
		}
	}

	self.getUserFont = function(){
		if(localStorage['UserFont'] == null || localStorage['UserFont'] == undefined){
			return null;
		}else{
			return localStorage['UserFont'];
		}
	}

	self.getUserCss = function(){
		if(localStorage['UserCSS'] == null || localStorage['UserCSS'] == undefined){
			return null;
		}else{
			return localStorage['UserCSS'];
		}
	}

	self.getCurrentTab = function(callfunc){
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	      	callfunc(tabs[0]);
	    });
	}

	return self;
}



function Run(tabId,info,url){
	if(url.match("www.baidu")){

        	if(localStorage['Theme'] == "disableBd_AD.css"){
        		//chrome.tabs.insertCSS(tabId, {file: localStorage['Theme']});
					if(localStorage['UserTheme'] == null){

						return ;
					}else{

			        	var imageurl = getImageCode("UserTheme","web");

			        	chrome.tabs.executeScript({code: imageurl});
					}
        		return;
        	}


        	chrome.tabs.insertCSS(tabId, {file: localStorage['Theme']});
        	var imageurl = getImageCode("UserTheme","chrome");

        	chrome.tabs.executeScript({code: imageurl});
        	return ;
        }
        if(url.match("https") || url.match("http") || url.match("www.")){
        	
        	if(localStorage['Theme'] == "disableBd_AD.css"){
        		chrome.tabs.insertCSS(tabId, {file: localStorage['Theme']});
        	}
			
			if(localStorage['UserTheme'] == null){
				return ;
			}else{
		        var imageurl = getImageCode("UserTheme","web");
	        	chrome.tabs.executeScript({code: imageurl});
			}


        	return ;
        }

}

function getImageCode(url,model){
	if(model == "chrome"){

		var imagePath =  chrome.extension.getURL(url);
        var imageurl = 'document.body.style.backgroundImage="url(imagePath)";'
        imageurl = imageurl.replace("imagePath",imagePath);
        return imageurl;

	}else if(model == "web"){

		var imagePath =  localStorage[url];
    	var imageurl = 'document.body.style.backgroundImage="url(imagePath)";'
	    imageurl = imageurl.replace("imagePath",imagePath);
	    return imageurl;
	}
} 


////  网址处理
function getDomainFromUrl(url){
     var host = "null";
     if(typeof url == "undefined" || null == url)
          url = window.location.href;
     var regex = /.*\:\/\/([^\/]*).*/;
     var match = url.match(regex);
     if(typeof match != "undefined" && null != match)
          host = match[1];
     return host;
}

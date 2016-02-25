var clickID = new Array(4);

clickID[0] = "#themem0";
clickID[1] = "#themem1";
clickID[2] = "#themem2";
clickID[3] = "#Apply";

var ccsSet = new Array(5);

ccsSet[0] = "black.css";
ccsSet[1] = "green.css";
ccsSet[2] = "disableBd_AD.css";
ccsSet[3] = localStorage['UserTheme'];
ccsSet[4] = localStorage['ColorValue'];

function Main(){

	self = this;

	self.radioClick = function(){

		var aInput = document.getElementsByName("Theme");  
		for (var i = 0; i < aInput.length; i++) {
			if(aInput[i].checked == true){
				localStorage.removeItem("Theme");
				localStorage.setItem("Theme",aInput[i].value);
				console.log(localStorage['Theme']);
				self.switchTheme(aInput[i].value);
				break;
			}
		};
	}

	self.init = function(){
		
		$(document).ready(function () {

		     $(clickID[0]).click(function () {
		          self.radioClick();
		      });

		     $(clickID[1]).click(function () {
		          self.radioClick();
		      });

		     $(clickID[2]).click(function () {
		          self.radioClick();
		          self.sendMessage({state:"reload"});
		          parent.window.location.reload();
		          
		      });	

		     $(clickID[3]).click(function () {
		     	self.Apply();
		      });	 

		     $("#colorinput").click(function () {
		        console.log("colorinput click!");
		        document.getElementById("colordiv").style.height="150px";
		        document.getElementById("colordiv").style.width="230px";
		      });    

		     $("#colorinput").blur(function () {
		        document.getElementById("colordiv").style.height="30px";
		        document.getElementById("colordiv").style.width="150px";
		      });

		 });
		

		self.run();

	}


	self.Apply = function(){
		localStorage['UserTheme'] = document.getElementById("text").value;
        self.radioClick();

        if(document.getElementById("enable").checked){
        	var colorvalues = document.getElementById("colorinput").value;
        	var fontobj = document.getElementById("fontSelect");
        	var UserCss = document.getElementById("UserCss").value; 
        	console.log(UserCss);
        	UserCss = (self.IsCss(UserCss) == true ? UserCss:localStorage['UserCSS']);
        	localStorage['ColorValue'] = colorvalues;
        	localStorage['UserFont'] = fontobj.options[fontobj.selectedIndex].text;
        	localStorage['UserCSS'] = UserCss;
        	localStorage['enable'] = 'true';
        	if(!document.getElementById("enablecolro").checked){
        		localStorage['ColorValue'] = null;
        	}
        	if(!self.IsCss(UserCss)){
        		
        		chrome.tabs.executeScript({code: 'console.log(alert("错误 请输入正确的CSS样式!"));'});
        	}
        }else{
        	localStorage['ColorValue'] = localStorage['UserFont'] = localStorage['UserCSS'] = null;
        	localStorage['enable'] = 'false';       	
        }
        self.sendMessage({state:"reload"});
	}


	self.LoadCSS = function(url){
		var s = document.createElement("LINK");
		s.rel = "stylesheet";
		s.type = "text/css";
		s.href = url;
		document.getElementsByTagName("HEAD")[0].appendChild(s);		
	}

	self.switchTheme = function(themeName){
		self.LoadCSS(themeName);
		chrome.runtime.sendMessage({DataInfo:{state:"switchTheme"}});
	}

	self.run = function(){
		if(document.getElementById("themem0") == null){
			return ;
		}

		if(localStorage['Theme'] == ccsSet[0]){
			document.getElementById("themem0").checked=true;
		}else if(localStorage['Theme'] == ccsSet[1]){
			document.getElementById("themem1").checked=true;
		}else{
			document.getElementById("themem2").checked=true;
		}

		self.LoadCSS(localStorage['Theme']);

		document.getElementById("text").value = localStorage['UserTheme'];		
		var objfont = document.getElementById("fontSelect");
		for (var i = 0; i < objfont.options.length; i++) {
			if(objfont.options[i].text == localStorage['UserFont']){
				objfont.options[i].selected = true;
				break;
			}
		};
       	document.getElementById("UserCss").value = (localStorage['UserCSS'] == 'null' ? "":localStorage['UserCSS']); 


		if(localStorage['ColorValue'] == 'null' || localStorage['ColorValue'] == undefined){
			document.getElementById("colorinput").value = '000000';
			document.getElementById("enablecolro").checked = false;
		}else{
			document.getElementById("colorinput").value = localStorage['ColorValue'];
			document.getElementById("enablecolro").checked = true;
		}

		if(localStorage['enable'] == 'true' || localStorage['enable'] == undefined){
			document.getElementById("enable").checked = true;
		}else{
			document.getElementById("enable").checked = false;
		}
		


		if(document.getElementById("colorinput").value == 'null'){
			
		}
		document.getElementById("colorinput").style.backgroundColor = '#' + document.getElementById("colorinput").value;
	}

	self.sendMessage = function(str){
		chrome.runtime.sendMessage({DataInfo:str});
	}

	//  是否是CSS
	self.IsCss = function(str){
		if(str.match("{") && str.match("}") && str.match(";") && str.match(":")){
			return true;
		}
		return false;
	}
	

}


window.onload = function(){
	var Director = new Main();

	Director.init();
}




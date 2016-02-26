

function OperationData(){
	self = this;


	self.init = function(){
			$(document).ready(function () {
				$('#copy').click(function () {
					self.copy();     	
			      });


				$('#import').click(function () {
					self.import();     	
			      });
			});

			self.readConfig();
	};

	self.readConfig = function(){
		result = "{" + self.generate("Theme",localStorage['Theme']) + "," + 
		self.generate("UserTheme",localStorage['UserTheme']) + "," + 
		self.generate("ColorValue",localStorage['localStorage']) + "," + 
		self.generate("UserFont",localStorage['UserFont']) + "," + 
		self.generate("UserCSS",localStorage['UserCSS']) + "," + 
		self.generate("enable",localStorage['enable']) + "}"
		;
		document.getElementById("Config").value = result;
		var btn = document.getElementById('copy');
	    var clipboard = new Clipboard(btn);

	    clipboard.on('success', function(e) {
	        alert("复制成功!");
	        delete clipboard;
	    });

	    clipboard.on('error', function(e) {
	        alert("复制失败! Chrome 版本 内核不支持!");
	        delete clipboard;
	    });
	}


	self.copy = function(){
	    

	};


	self.import = function(){
		result = document.getElementById("Config").value;
		obj = JSON.parse(result);
		localStorage['Theme'] = obj.Theme;
		localStorage['UserTheme'] = obj.UserTheme;
		localStorage['ColorValue'] = obj.ColorValue;
		localStorage['UserFont'] = obj.UserFont;
		localStorage['UserCSS'] = obj.UserCSS;
		localStorage['enable'] = obj.enable;
		//console.log(obj);
		alert("导入成功!");
	};


	self.generate = function(key,value){
		if(value == 'null' || value == undefined){
			value = '';
		}
		result =  "\"";
		result += key;
		result += "\":";
		result += "\"";
		result += value;
		result += "\"";
		return result;
	}

	return self;
};


OperationData().init();

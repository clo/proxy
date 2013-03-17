var http = require('http');
var url = require("url");
var credential = { 'ip-dumy-ch-bri-r-003' : { access: 'SSH', password: 'secret' }}
var response = "";

http.createServer(function (req, res) {
  req.on("end", function () {
    if (response!=''){
	  res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(response);
	}else{
	  res.writeHead(400, {'Content-Type': 'text/plain'});
	  res.end('bad request');
	}
  });
  
  req.on("data", function(chunk) {
    password="";
	access="";
	var	params = chunk.toString().split("&");
	var device="";
	var action="";
	var command="";
	for (var i=0;i<params.length;i++){
	  var param = params[i].split('=');
	  var key = param[0];
	  var value = param[1];
	  if (key=='device'){
	    device=value;
		console.log("device found: " + device);
	  }
	  if (key=='action'){
	    action=value;
	  }
	  if (key=='command'){
	    command=value;
	  }
	}
	if (device!=""){
	  var keyFound = false;
	  if (action=='CREDENTIAL'){
	    for (var key in credential){
	      if (key==device) {
	        console.log(key + "=%j",credential[key]);
		    keyFound = true;
		    response = '{';
			response=response + 'cli : ' + credential[device]['access'] + ',';
		    response=response + 'password : ' + credential[device]['password'];
			response=response + '}';
	      }
	    }
	  }else if (action=='SNMP'){
	    response='TODO: SNMP';
	  }else if (action=='SSH'){
	    response='TODO: SSH';
	  }
	}
  });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
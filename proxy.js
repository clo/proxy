var http = require('http');
var url = require("url");
var credential = { 'ip-dumy-ch-bri-r-003' : { access: 'SSH', password: 'secret' }}
var response = "";

http.createServer(function (req, res) {
  console.log("request: " + req.method);
  
  req.on("end", function () {
    if (password!=''){
	res.writeHead(200, {'Content-Type': 'text/plain'});
    var get = url.parse(req.headers.host).query;
	console.log(get);
	res.end(response);
	}else{
	  res.writeHead(400, {'Content-Type': 'text/plain'});
	  res.end(response);
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
	  }else{
	    response='bad request';
	  }
	  if (!keyFound){
		console.log("no key found for " + device);
	  }
	}
  });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
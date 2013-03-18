var http  = require('http')
 ,   mysql = require('mysql');
var credential = { 'ip-dumy-ch-bri-r-003' : { access: 'SSH', password: 'secret' }}
var response = "";
var credstore = Array();;
var dbuser = 'root';
var dbpass = '';

var client = mysql.createClient({
  user: dbuser,
  password: dbpass,
});
client.useDatabase('nmdb_tis');

var sql = "SELECT name,ro,ipaddr FROM tis_dev_community"; 
client.query(sql, 
  function(err, results, fields) {
    for (var index in results) {
      var idx = results[index].name;
      credstore[idx]='ro=' + results[index].ro + ';ip=' + results[index].ipaddr;
    }
    console.log("NMDB credstore loaded with " + credstore.length);
  }
); 

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
	var params = chunk.toString().split("&");
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
          if(device!='' && action=='CREDENTIAL'){
	    var keyFound = false;
	    for (var key in credstore){
	      if (key==device) {
	        console.log(key + "=%j",credential[key]);
		keyFound = true;
		response = '{';
		//response=response + 'cli : ' + credstore[device]['access'] + ',';
		response=response + 'credential : ' + credstore[device];
		response=response + '}';
	      }
            }
          }
          if(keyFound && action=='CREDENTIAL') {
	  }else if (action=='SNMP'){
	    response='TODO: SNMP';
	  }else if (action=='SSH'){
	    response='TODO: SSH';
	  }else{
            response='';
          }
  });
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');

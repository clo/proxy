var http = require('http');
var querystring = require('querystring');  

var data = querystring.stringify({ 
 'device'  : process.argv[2],
 'command' : 'command goes here!',
 'cli'     : 'SSH',
 'action'  : process.argv[3], //could CREDENTIAL, SNMP, SSH
 'command' : 'uptime',
 'oid'     : ''
});

var options = {
  hostname: '127.0.0.1',
  port: 1337,
  path: '/',
  method: 'POST',
  headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length
      } 
};


var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk.toString());
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.write(data);
req.end();
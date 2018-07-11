const http = require('http');
 var fs = require('fs');
var querystring = require('querystring');

    var path = require('path');

var port = process.env.PORT || 8080;
		// testing working woth JSON data as DB START

'use strict';
var contents = fs.readFileSync(path.join(process.cwd(), 'users.json'));
var dj = JSON.parse(contents);



function processPost(request,response,callback)

{
	let body = [];
	  if(request.method == 'POST') {
		  request.on('error', (err) => {
			console.error(err);
		  }).on('data', function(chunk) {
			  console.log("chunk: " + chunk);
			body.push(chunk);
		  }).on('end', function() {
			request.post = Buffer.concat(body).toString();
			callback();
			
			  });
	  }
	
}
 
http.createServer((request, response) => {
	
	//console.log(request);
  const { headers, method, url} = request;
  
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.
	console.log(url);
	
	// Enabling cors
	  if (request.method === 'OPTIONS') {
        console.log('!OPTIONS');
        //var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        response.writeHead(200, headers);
        response.end();
    }
	
	response.on('error', (err) => {
			  console.error(err);
			});
			
	
	switch(url)
	{
		case '/clientjs.html':
			var filename = "." + url;
	
		//	fs.readFile(filename, function(err, data) 
			fs.readFile(path.join(process.cwd(), 'clientjs.html'), function(err, data)
		{
			if (err) {
				console.log('error ' + err);
				response.writeHead(404, {'Content-Type': 'text/html'});
				response.end();
			} 
			else
			{
				
				console.log('sending home.html');
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(data);
				response.end();
			}
			});
			break;
			
		case '/login':
		
		
		if(method == 'POST') {
			processPost(request,response,function()
			{
				console.log("req post: " + request.post);
			
				var user = JSON.parse(request.post).username;
				var password = JSON.parse(request.post).password
				/////var res = n1+n2;
				
		
				var uuu = dj.find(item => 
					{ return item.user.username == user && item.user.password == password
			});
	
			console.log(uuu);
			
			
			
			response.writeHead(200, {'Content-Type': 'application/json'});
			//response.write(JSON.stringify(request.post));
			response.write(JSON.stringify({result:uuu}));
			response.end();
		  
		  
	  });
	}
			
			break;
		case '/register':	
			console.log("register")
		if(method == 'POST') {
			processPost(request,response,function()
			{
				console.log("register post: " + request.post);
			
				var obj = JSON.parse(request.post);
				var user = JSON.parse(request.post).username;
				var password = JSON.parse(request.post).password
				/////var res = n1+n2;
				
		
				var uuu = dj.find(item => 
					{ return item.user.username == user && item.user.password == password

					});				
					console.log("uuu is: " + uuu);
			
				//if (uuu== null) // this means new user -> enter to db

				//{
					console.log("dj : " + dj);
					console.log("contents : "+contents);
					dj.push(obj);
					
					fs.writeFileSync(path.join(process.cwd(),'users.json'), JSON.stringify(dj));  
					
				//}					
			
			
	
		//	console.log(uuu);
			
			
			
			response.writeHead(200, {'Content-Type': 'application/json'});
			//response.write(JSON.stringify(request.post));
			response.write(JSON.stringify({result:"success"}));
			response.end();
		  
		  
	  });
	}
		
		
		break;
			
		default:
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write("The SERVER is ON");
			response.end();
			
		
	}
	
		
	
	
	
	
  
}).listen(port); // Activates this server, listening on port 8080.
